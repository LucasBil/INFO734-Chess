<script setup>
    import { onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useSocketStore } from '@/stores/socket';
    import { useProfileStore } from '@/stores/profile';
    import BoardComponent from '@/components/BoardComponent.vue';
    import ProfileAvatarComponent from '@/components/ProfileAvatarComponent.vue';
    import Profile from '@/models/Profile';
    // Animation
    import VersusAnimation from '@/components/VersusAnimation.vue';
    import VictoryAnimation from '@/components/VictoryAnimation.vue';
    // Icons
    import BotIcon from '@/assets/icons/bot.svg'
    import AnonymeIcon from '@/assets/icons/anonyme.svg'
    import { BackwardIcon, ForwardIcon, BookOpenIcon } from '@heroicons/vue/24/outline';

    const route = useRoute();
    const router = useRouter();
    const socketStore = useSocketStore();
    const profileStore = useProfileStore();

    const board = ref(null);
    const bot = route.params.level;
    const profile = ref(null);
    const opponent = ref(null);

    const side = ref(null);
    const orientation = ref(null);

    const animation = ref(null);
    const winner = ref(null);
    const reason = ref(null);

    onMounted(() => {
        if (bot) {
            opponent.value = new Profile(null, `Bot (level: ${bot})`, BotIcon)
            profile.value = profileStore?.profile ?? new Profile(null, `Anonyme`, AnonymeIcon);
            orientation.value = "white";
        }
        else {
            if (!socketStore?.isConnected) {
                router.push({ name: 'home' })
                return;
            }

            opponent.value = socketStore?.opponent?.profile;
            profile.value = profileStore?.profile;
            orientation.value = socketStore?.color;

            socketStore.on('MOVE', (move) => {
                board.value?.playMove(move.from, move.to, move.promotion);
            });

            socketStore.on('OPPONENT_LEFT', (e) => {
                gameEnd(side.value, 'OPPONENT_LEFT');
            });
        }
        side.value = orientation.value?.toLocaleLowerCase()?.charAt(0);

        // Animation
        animation.value = "versus"
    });

    function gameEnd(_winner, _reason) {
        winner.value = side.value == _winner ? profile.value : opponent.value;
        reason.value = _reason;
        animation.value = "victory"
    }
</script>

<template>
    <div class="grow p-3 flex flex-col gap-2">
        <VersusAnimation v-if="animation == 'versus'" @animation-end="animation = null" :player_1="profile" :player_2="opponent"/>
        <VictoryAnimation v-if="animation == 'victory'" @animation-end="router.push({ name: 'home' })" :winner="winner" :reason="reason"/>
        <!---#region PLAYER INFO 1 -->
        <div>
            <div class="flex flex-col items-end">
                <ProfileAvatarComponent v-if="opponent" status="online" :profile="opponent" />
            </div>
        </div>
        <!---#endregion -->
        
        <BoardComponent v-if="orientation && side" class="grow w-full flex items-center self-center py-2 sm:w-md"
            ref="board"
            :side="side"
            :orientation="orientation"
            v-bind="{
                ...(bot ? { 'bot': bot } : {}),
            }"
            @move="(e) => socketStore.sendMove(e.move)"
            @end="(e) => gameEnd(e.winner, e.reason)" />

        <!---#region PLAYER INFO 2 -->
        <div>
            <div class="flex flex-col items-start">
                <ProfileAvatarComponent v-if="profile" status="online" :profile="profile" :reverse="true" />
            </div>
        </div>
        <!---#endregion -->

        <div class="join self-center">
            <button class="btn btn-soft join-item">
                <BackwardIcon class="w-6 h-6" />
            </button>
            <button class="btn join-item">
                <BookOpenIcon class="w-6 h-6" />
            </button>
            <button class="btn btn-soft join-item">
                <ForwardIcon class="w-6 h-6" />
            </button>
        </div>
    </div>
</template>
<script setup>
    import { onMounted, ref, computed, onUnmounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useSocketStore } from '@/stores/socket';
    import { useProfileStore } from '@/stores/profile';
    
    // Components
    import BoardComponent from '@/components/BoardComponent.vue';
    import SidebarComponent from '@/components/SidebarComponent.vue';
    
    import Profile from '@/models/Profile';
    import VersusAnimation from '@/components/VersusAnimation.vue';
    import VictoryAnimation from '@/components/VictoryAnimation.vue';
    
    import BotIcon from '@/assets/icons/bot.svg'
    import AnonymeIcon from '@/assets/icons/anonyme.svg'
    import { BackwardIcon, ForwardIcon, BookOpenIcon } from '@heroicons/vue/24/outline';

    const route = useRoute();
    const router = useRouter();
    const socketStore = useSocketStore();
    const profileStore = useProfileStore();

    const board = ref(null);
    const sidebar = ref(null);
    const bot = route.params.level;
    const profile = ref(null);
    const opponent = ref(null);

    const side = ref(null);
    const orientation = ref(null);
    const activePlayer = ref('w'); 
    
    const whiteTime = ref(10 * 60 * 1000);
    const blackTime = ref(10 * 60 * 1000);
    const timerInterval = ref(null);

    const animation = ref(null);
    const winner = ref(null);
    const reason = ref(null);

    const whitePlayer = computed(() => {
        if (!orientation.value || !profile.value) return { pseudo: 'White', avatar: AnonymeIcon };
        return orientation.value === 'white' ? profile.value : opponent.value;
    });

    const blackPlayer = computed(() => {
        if (!orientation.value || !profile.value) return { pseudo: 'Black', avatar: AnonymeIcon };
        return orientation.value === 'white' ? opponent.value : profile.value;
    });

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
        animation.value = "versus"
        startTimer(); 
    });

    onUnmounted(() => {
        clearInterval(timerInterval.value);
    });

    // --- Navigation Logic ---

    // Called when sidebar emits jump-to-move
    function onJumpToMove(payload) {
        if (payload.index === -1) {
            // Jump to start
            board.value?.resetToStart();
        } else if (payload.fen) {
            // Restore specific position
            board.value?.restorePosition(payload.fen);
        }
    }

    // Button Handlers
    function goBack() {
        sidebar.value?.goBack();
    }

    function goForward() {
        sidebar.value?.goForward();
    }

    function handleMove(moveData) {
        if (!bot && moveData.color === side.value) {
            // Send aggregated move data containing 'from', 'to' AND 'fen'
            socketStore.sendMove({
                ...moveData.move,
                fen: moveData.fen
            });
        }

        if (sidebar.value) {
            sidebar.value.addMove({
                from: moveData.move.from,
                to: moveData.move.to,
                piece: moveData.piece,
                color: moveData.color,
                captured: moveData.captured,
                promotion: moveData.promotion,
                check: moveData.check,
                checkmate: moveData.checkmate,
                castling: moveData.castling,
                fen: moveData.fen
            });
        }

        activePlayer.value = moveData.color === 'w' ? 'b' : 'w';
    }

    function startTimer() {
        clearInterval(timerInterval.value);
        timerInterval.value = setInterval(() => {
            if (animation.value === 'victory') return;
            if (activePlayer.value === 'w') {
                if (whiteTime.value > 0) whiteTime.value -= 100;
            } else {
                if (blackTime.value > 0) blackTime.value -= 100;
            }
        }, 100);
    }

    function gameEnd(_winner, _reason) {
        clearInterval(timerInterval.value);
        winner.value = side.value == _winner ? profile.value : opponent.value;
        reason.value = _reason;
        animation.value = "victory"

        // Notify server to save game if not a bot game
        if (!bot) {
            if (_reason === 'checkmate') {
                 // Only the winner sends MATE to claim victory and save game
                 if (side.value == _winner) {
                     socketStore.send('MATE');
                 }
            } else if (_reason === 'draw') {
                 socketStore.send('DRAW'); 
            } else if (_reason === 'stalemate') {
                 socketStore.send('STALEMATE');
            }
        }
    }
</script>

<template>
    <div class="h-[calc(100vh-64px)] w-full flex flex-col lg:flex-row bg-base-100 overflow-hidden">
        
        <VersusAnimation v-if="animation == 'versus'" @animation-end="animation = null" :player_1="profile" :player_2="opponent"/>
        <VictoryAnimation v-if="animation == 'victory'" @animation-end="router.push({ name: 'home' })" :winner="winner" :reason="reason"/>

        <div class="flex-1 flex flex-col min-h-0 p-2 lg:p-4 gap-4 justify-center items-center">
            
            <div class="w-full max-w-[75vh] aspect-square relative shadow-2xl rounded-sm">
                <BoardComponent 
                    v-if="orientation && side" 
                    class="absolute inset-0 w-full h-full"
                    ref="board"
                    :side="side"
                    :orientation="orientation"
                    :spare-pieces="false"
                    v-bind="{ ...(bot ? { 'bot': bot } : {}) }"
                    @move="handleMove"
                    @end="(e) => gameEnd(e.winner, e.reason)" 
                />
            </div>

            <div class="join shadow-lg shrink-0">
                <button class="btn btn-sm btn-soft join-item" @click="goBack">
                    <BackwardIcon class="w-5 h-5" />
                </button>
                
                <button class="btn btn-sm join-item">
                    <BookOpenIcon class="w-5 h-5" />
                </button>
                
                <button class="btn btn-sm btn-soft join-item" @click="goForward">
                    <ForwardIcon class="w-5 h-5" />
                </button>
            </div>
        </div>

        <div class="w-full lg:w-96 bg-base-200 border-l border-base-300 flex-none h-[35vh] lg:h-auto z-10">
            <SidebarComponent
                v-if="profile && opponent"
                ref="sidebar"
                :white-time="whiteTime"
                :black-time="blackTime"
                :active-player="activePlayer"
                :white-player="whitePlayer"
                :black-player="blackPlayer"
                :orientation="orientation"
                @jump-to-move="onJumpToMove"
            />
        </div>
    </div>
</template>
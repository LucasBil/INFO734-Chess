<script setup>
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { BackwardIcon, ForwardIcon, BookOpenIcon } from '@heroicons/vue/24/outline';
    import 'chessboard-element';
    import BoardComponent from '@/components/BoardComponent.vue';
    import ProfileAvatarComponent from '@/components/ProfileAvatarComponent.vue';

    const route = useRoute();
    const gameId = route.params.id;

    const profile = ref({
        name: 'Jane Doe',
        avatar: 'https://api-reader-prd.tinkercad.com/api/designs/eHrRL55g2u9/images/iIwmmVHjxbK/t725.jpg?contentType=tinkercad'
    });

    onMounted(() => {
        console.log(`Game ID from route: ${gameId}`);
    });
</script>

<template>
    <div class="grow p-3 flex flex-col gap-2">
        <!---#region PLAYER INFO 1 -->
        <div>
            <div class="flex flex-col items-end">
                <ProfileAvatarComponent status="online" :profile="profile" />
            </div>
        </div>
        <!---#endregion -->
        
        <BoardComponent class="grow w-full flex items-center py-2" />

        <!---#region PLAYER INFO 2 -->
        <div>
            <div class="flex flex-col items-start">
                <ProfileAvatarComponent status="online" :profile="profile" :reverse="true" />
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
<script setup>
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import 'chessboard-element';
    import BoardComponent from '@/components/BoardComponent.vue';
    import StatusComponent from '@/components/StatusComponent.vue';

    const route = useRoute();
    const gameId = route.params.id;

    onMounted(() => {
        console.log(`Game ID from route: ${gameId}`);
    });
</script>

<template>
    <StatusComponent />
    <div class="w-75">
        <BoardComponent />
    </div>
</template>
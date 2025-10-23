<script setup>
    import { onMounted, nextTick, ref } from 'vue';
    import { initChessBoard } from '@/utils/chessLogic';
    import 'chessboard-element';

    const board = ref(null);

    function updateBoardHeight() {
        const boardEl = board.value;
        if (!boardEl) return;

        const shadowBoard = boardEl.shadowRoot?.querySelector('div[part="board"]');
        if (!shadowBoard) return;

        const boardHeight = shadowBoard.style.height;
        boardEl.style.height = boardHeight;
    }

    function handleResize() {
        updateBoardHeight();
        board.value?.resize();
    }

    onMounted(async () => {
        await nextTick();
        updateBoardHeight();
        board.value?.start();
        initChessBoard(board.value);
        window.addEventListener('resize', handleResize);
    });
</script>

<template>
    <div class="">
        <chess-board
            ref="board"
            style="width: 100%; z-index: 0;"
            hide-notation
            draggable-pieces></chess-board>
    </div>
</template>
<script setup>
    import { defineProps, onMounted, nextTick, ref, defineEmits, defineExpose } from 'vue';
    import 'chessboard-element';
    import { Chess } from 'chess.js';
    import { aiMove } from 'js-chess-engine';
    import Pieces from '@/utils/pieces';

    /*
    //#region resize board
    // function updateBoardHeight() {
    //     const boardEl = board.value;
    //     if (!boardEl) return;

    //     const shadowBoard = boardEl.shadowRoot?.querySelector('div[part="board"]');
    //     if (!shadowBoard) return;

    //     const boardHeight = shadowBoard.style.height;
    //     boardEl.style.height = boardHeight;
    // }

    // function handleResize() {
    //     updateBoardHeight();
    //     board.value?.resize();
    // }
    //#endregion
    // if (!props.sparePieces) {
    //     updateBoardHeight();
    //     window.addEventListener('resize', handleResize);
    // }
    */

    const props = defineProps({
        bot : { type: Number }, // If set, humain vs bot with bot level 0 to 4
        side : { type: String }, // [w, b]
        // Config : Board
        fen: { type: String, default: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' }, // Default position
        orientation: { type: String, default: 'white' }, // [white, black]
        draggablePieces: { type: Boolean, default: true },
        hideNotation: { type: Boolean, default: false },
        sparePieces: { type: Boolean, default: true },
        dropOffBoard: { type: String, default: 'snapback' },
        // => Style (Animaton + theme)
        highlightLegalMoves: { type: Boolean, default: true },
        animation: { type: Object }, // move-speed, snapback-speed, snap-speed
        theme: { type: String },
    });

    const board = ref(null);
    const game = new Chess(props.fen);
    const emit = defineEmits(['start', 'move', 'end']);
    defineExpose({ playMove });

    // Style Highlight
    const highlightStyles = document.createElement('style');
    document.head.append(highlightStyles);
    const whiteSquareGrey = '#a9a9a9';
    const blackSquareGrey = '#696969';

    onMounted(async () => {
        await nextTick();
        //#region init board
        board.value.setPosition(game.fen()); // set default position
        emit('start', { timestamps: Date.now(), fen: game.fen()});
        //#endregion

        board.value.addEventListener('drag-start', (e) => {
            if (
                !props.draggablePieces || // Not draggable piece
                game.isGameOver()// Game is over
            ) {
                e.preventDefault();
                return;
            }

            if (props.side && game.turn() != props.side) {
                e.preventDefault();
                return;
            }
        });

        board.value.addEventListener('drop', (e) => {
            const { source, target, setAction } = e.detail;
            if (props.highlightLegalMoves)
                removeGreySquares();

            try {
                let move = { from: source, to: target, promotion: Pieces.TYPES.QUEEN } // Promotion
                game.move(move);
                emit('move', { move: move, fen: game.fen()});
            } catch {
                setAction('snapback');
            }
        });

        board.value.addEventListener('snap-end', () => {
            board.value.setPosition(game.fen());
            if (game.isGameOver())
                emitGameOver(game)

            if (props.bot)
                botMove(props.bot);
        });

        if (props.highlightLegalMoves) {
            board.value.addEventListener('mouseover-square', (e) => {
                const { square } = e.detail;
                const moves = game.moves({ square, verbose: true });

                if (moves.length === 0) return;

                greySquare(square);
                for (const move of moves) {
                    greySquare(move.to);
                }
            });

            board.value.addEventListener('mouseout-square', removeGreySquares);
        }
    });

    function botMove(level) {
        let move = aiMove(game.fen(), level );
        let [from, to] = Object.entries(move)[0];
        move = { from: from.toLocaleLowerCase(), to: to.toLocaleLowerCase(), promotion: Pieces.TYPES.QUEEN}; //Promotion
        game.move(move);
        board.value.setPosition(game.fen());
        emit('move', { move, fen: game.fen()});
        if (game.isGameOver())
            emitGameOver(game)
    }

    function playMove(from, to, promotion=null) {
        try {
            game.move({ from, to, promotion });
            board.value.setPosition(game.fen());
        } catch { }
    }

    function removeGreySquares() {
        highlightStyles.textContent = '';
    }

    function greySquare(square) {
        const highlightColor = (square.charCodeAt(0) % 2) ^ (square.charCodeAt(1) % 2)
        ? whiteSquareGrey
        : blackSquareGrey;

        highlightStyles.textContent += `
        chess-board::part(${square}) {
            background-color: ${highlightColor};
        }
        `;
    }

    function emitGameOver(_game) {
        const reason = _game.isCheckmate() ? 'checkmate'
                            : _game.isDraw() ? 'draw'
                            : 'unknown';
        const winner = _game.isCheckmate()
                            ? _game.turn() === Pieces.WHITE ? Pieces.BLACK : Pieces.WHITE
                            : null;
        emit('end', { winner, reason, fen : _game.fen() })
    }
</script>

<template>
    <div>
        <chess-board
            ref="board"
            style="width: 100%; z-index: 0;"
            :orientation="orientation"
            v-bind="{
                ...(hideNotation ? { 'hide-notation': true } : {}),
                ...(sparePieces ? { 'spare-pieces': true } : {}),
                ...(draggablePieces ? { 'draggable-pieces': true } : {}),
                ...(dropOffBoard ? { 'drop-off-board': dropOffBoard } : {}),
                // Theme + Animation
                ...(animation?.move_speed ? { 'move-speed': `${animation.move_speed}` } : {}),
                ...(animation?.snapback_speed ? { 'snapback-speed': `${animation.snapback_speed}` } : {}),
                ...(animation?.snap_speed ? { 'snap-speed': `${animation.snap_speed}` } : {}),
                ...(theme ? { 'piece-theme': theme } : {}),
            }"></chess-board>
    </div>
</template>
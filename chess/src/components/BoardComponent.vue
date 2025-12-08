<script setup>
    import { defineProps, onMounted, nextTick, ref, defineEmits, defineExpose } from 'vue';
    import 'chessboard-element';
    import { Chess } from 'chess.js';
    import { aiMove } from 'js-chess-engine';
    import Pieces from '@/utils/pieces.js';

    const props = defineProps({
        bot : { type: Number },
        side : { type: String },
        fen: { type: String, default: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' }, 
        orientation: { type: String, default: 'white' },
        draggablePieces: { type: Boolean, default: true },
        hideNotation: { type: Boolean, default: false },
        sparePieces: { type: Boolean, default: true },
        dropOffBoard: { type: String, default: 'snapback' },
        highlightLegalMoves: { type: Boolean, default: true },
        animation: { type: Object },
        theme: { type: String },
    });

    const board = ref(null);
    const game = new Chess(props.fen);
    const emit = defineEmits(['start', 'move', 'end']);
    defineExpose({ playMove, getPosition, restorePosition, resetToStart });

    // Style Highlight
    const highlightStyles = document.createElement('style');
    document.head.append(highlightStyles);
    const whiteSquareGrey = '#a9a9a9';
    const blackSquareGrey = '#696969';

    onMounted(async () => {
        await nextTick();
        board.value.setPosition(game.fen()); 
        emit('start', { timestamps: Date.now(), fen: game.fen()});

        board.value.addEventListener('drag-start', (e) => {
            if (!props.draggablePieces || game.isGameOver()) {
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
            if (props.highlightLegalMoves) removeGreySquares();

            try {
                let move = { from: source, to: target, promotion: Pieces.TYPES.QUEEN } 
                const result = game.move(move);
                
                emit('move', { 
                    move: move, 
                    fen: game.fen(),
                    piece: result.piece,
                    color: result.color,
                    captured: result.captured,
                    promotion: result.promotion,
                    check: game.inCheck(),
                    checkmate: game.isCheckmate(),
                    castling: result.flags.includes('k') ? 'k' : result.flags.includes('q') ? 'q' : null
                });
            } catch {
                setAction('snapback');
            }
        });

        board.value.addEventListener('snap-end', () => {
            board.value.setPosition(game.fen());
            if (game.isGameOver()) {
                emitGameOver(game)
                return;
            }

            if (props.bot !== undefined && game.turn() !== props.side) {
                setTimeout(() => {
                    botMove(props.bot);
                }, 500);
            }
        });

        if (props.highlightLegalMoves) {
            board.value.addEventListener('mouseover-square', (e) => {
                const { square } = e.detail;
                if (props.side && game.turn() !== props.side) return; // Only highlight on your turn

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
        try {
            let moveObj = aiMove(game.fen(), level);
            let [from, to] = Object.entries(moveObj)[0];
            let move = { from: from.toLowerCase(), to: to.toLowerCase(), promotion: Pieces.TYPES.QUEEN}; 
            
            const result = game.move(move);
            board.value.setPosition(game.fen());
            
            emit('move', { 
                move, 
                fen: game.fen(),
                piece: result.piece,
                color: result.color,
                captured: result.captured,
                promotion: result.promotion,
                check: game.inCheck(),
                checkmate: game.isCheckmate(),
                castling: result.flags.includes('k') ? 'k' : result.flags.includes('q') ? 'q' : null
            });
            
            if (game.isGameOver()) emitGameOver(game)
        } catch (e) { console.error("Bot Error", e) }
    }

    function playMove(from, to, promotion=null) {
        try {
            const result = game.move({ from, to, promotion });
            board.value.setPosition(game.fen());
            
            emit('move', { 
                move: { from, to, promotion }, 
                fen: game.fen(),
                piece: result.piece,
                color: result.color,
                captured: result.captured,
                promotion: result.promotion,
                check: game.inCheck(),
                checkmate: game.isCheckmate(),
                castling: result.flags.includes('k') ? 'k' : result.flags.includes('q') ? 'q' : null
            });
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

    function getPosition() { return game.fen(); }

    function restorePosition(fen) {
        try {
            game.load(fen);
            board.value.setPosition(game.fen());
        } catch (error) { console.error('Failed to restore position:', error); }
    }

    function resetToStart() {
        game.reset();
        board.value.setPosition(game.fen());
    }
</script>

<template>
    <div class="w-full h-full">
        <chess-board
            ref="board"
            style="width: 100%; height: 100%; display: block;"
            :orientation="orientation"
            v-bind="{
                ...(hideNotation ? { 'hide-notation': true } : {}),
                ...(sparePieces ? { 'spare-pieces': true } : {}),
                ...(draggablePieces ? { 'draggable-pieces': true } : {}),
                ...(dropOffBoard ? { 'drop-off-board': dropOffBoard } : {}),
                ...(animation?.move_speed ? { 'move-speed': `${animation.move_speed}` } : {}),
                ...(animation?.snapback_speed ? { 'snapback-speed': `${animation.snapback_speed}` } : {}),
                ...(animation?.snap_speed ? { 'snap-speed': `${animation.snap_speed}` } : {}),
                ...(theme ? { 'piece-theme': theme } : {}),
            }"></chess-board>
    </div>
</template>
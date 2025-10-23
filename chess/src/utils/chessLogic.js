// src/utils/chessLogic.js
import { Chess } from 'chess.js'; // si tu l'utilises via npm install chess.js

export function initChessBoard(boardElement) {
  const board = boardElement;
  const game = new Chess();

  const highlightStyles = document.createElement('style');
  document.head.append(highlightStyles);
  const whiteSquareGrey = '#a9a9a9';
  const blackSquareGrey = '#696969';

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

  board.addEventListener('drag-start', (e) => {
    const { source, piece } = e.detail;

    if (game.game_over()) {
      e.preventDefault();
      return;
    }

    if ((game.turn() === 'w' && piece.startsWith('b')) ||
        (game.turn() === 'b' && piece.startsWith('w'))) {
      e.preventDefault();
      return;
    }
  });

  board.addEventListener('drop', (e) => {
    const { source, target, setAction } = e.detail;
    removeGreySquares();

    const move = game.move({
      from: source,
      to: target,
      promotion: 'q'
    });

    if (move === null) setAction('snapback');
  });

  board.addEventListener('mouseover-square', (e) => {
    const { square } = e.detail;
    const moves = game.moves({ square, verbose: true });

    if (moves.length === 0) return;

    greySquare(square);
    for (const move of moves) {
      greySquare(move.to);
    }
  });

  board.addEventListener('mouseout-square', removeGreySquares);

  board.addEventListener('snap-end', () => {
    board.setPosition(game.fen());
  });
}

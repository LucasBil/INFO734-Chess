export default class Pieces {
  // Couleurs
  static WHITE = 'w';
  static BLACK = 'b';

  // Types de pièces
  static TYPES = {
    PAWN: 'p',
    KNIGHT: 'n',
    BISHOP: 'b',
    ROOK: 'r',
    QUEEN: 'q',
    KING: 'k',
  };

  // Optionnel : méthode utilitaire
  static getPieceSymbol(color, type) {
    if (![this.WHITE, this.BLACK].includes(color)) return null;
    if (!Object.values(this.TYPES).includes(type)) return null;
    return color + type;
  }

  // Exemple : obtenir le symbole Unicode
  static getUnicode(color, type) {
    const unicodePieces = {
      w: {
        p: '♙', n: '♘', b: '♗', r: '♖', q: '♕', k: '♔',
      },
      b: {
        p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚',
      },
    };
    return unicodePieces[color]?.[type] ?? '';
  }
}
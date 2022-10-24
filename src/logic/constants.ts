export const BOARD_SIZE = 8;
export enum PieceType {
  PAWN = "p",
  KNIGHT = "n",
  BISHOP = "b",
  ROOK = "r",
  QUEEN = "q",
  KING = "k",
}
export enum PieceColor {
  WHITE = "w",
  BLACK = "b",
}
export enum HightlightType {
  None,
  PossibleMove,
  Capture,
  Check,
  Origin,
  Castling,
}
export const PIECE_BEHAVIOUR: {
  [key in PieceType]: PieceBehaiourData;
} = {
  p: {
    moveDirections: [{ file: 1, rank: 0 }],
    maxMove: 1,
    firstMoveMax: 2,
    specialAttack: [
      { file: 1, rank: 1 },
      { file: 1, rank: -1 },
    ],
  },
  n: {
    moveDirections: [
      { file: 2, rank: 1 },
      { file: 2, rank: -1 },
      { file: -2, rank: 1 },
      { file: -2, rank: -1 },

      { file: 1, rank: 2 },
      { file: 1, rank: -2 },
      { file: -1, rank: 2 },
      { file: -1, rank: -2 },
    ],
    maxMove: 1,
  },
  b: {
    moveDirections: [
      { file: 1, rank: 1 },
      { file: 1, rank: -1 },
      { file: -1, rank: 1 },
      { file: -1, rank: -1 },
    ],
    maxMove: 8,
  },
  r: {
    moveDirections: [
      { file: 1, rank: 0 },
      { file: -1, rank: 0 },
      { file: 0, rank: 1 },
      { file: 0, rank: -1 },
    ],
    maxMove: 8,
  },
  q: {
    moveDirections: [
      { file: 1, rank: 0 },
      { file: -1, rank: 0 },
      { file: 0, rank: 1 },
      { file: 0, rank: -1 },
      { file: 1, rank: 1 },
      { file: 1, rank: -1 },
      { file: -1, rank: 1 },
      { file: -1, rank: -1 },
    ],
    maxMove: 8,
  },
  k: {
    moveDirections: [
      { file: 1, rank: 0 },
      { file: -1, rank: 0 },
      { file: 0, rank: 1 },
      { file: 0, rank: -1 },
      { file: 1, rank: 1 },
      { file: 1, rank: -1 },
      { file: -1, rank: 1 },
      { file: -1, rank: -1 },
    ],
    maxMove: 1,
  },
};

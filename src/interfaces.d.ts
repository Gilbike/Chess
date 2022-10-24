interface ChessGameConfig {
  startingFen?: string;
  startingSide?: PieceColor;
  lightPlayerName?: string;
  darkPlayerName?: string;
  lightTileColor?: string;
  darkTileColor?: string;
}

interface Position {
  file: Number;
  rank: Number;
}

interface ParsedFEN {
  location: Position;
  color: PieceColor;
  type: PieceType;
}

interface PieceBehaiourData {
  moveDirections: Position[];
  maxMove: Number;
  specialAttack?: Position[];
  firstMoveMax?: Number;
}

interface ValidMove {
  location: Position;
  moveType: HightlightType;
}

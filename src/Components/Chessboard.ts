import { createElement } from "../logic/util";
import { BOARD_SIZE, PieceColor } from "../logic/constants";
import Field from "./Field";
import Piece from "./Piece";
import Notation from "../logic/notation";
import { FieldDisplayMode, GetConfig } from "../logic/config";

export default class Chessboard {
  private boardElement: HTMLElement;
  private gridElement: HTMLElement;
  private shownSide: PieceColor;
  static Instance: Chessboard;

  constructor(element: HTMLElement) {
    Chessboard.Instance = this;
    this.boardElement = createElement("g-board");
    this.gridElement = createElement("g-fields");
    this.boardElement.append(this.gridElement);
    element.append(this.boardElement);

    // load board
    for (let f = BOARD_SIZE; f > 0; f--) for (let r = 1; r <= BOARD_SIZE; r++) new Field(this.gridElement, { file: f, rank: r });
    this.shownSide = PieceColor.WHITE;

    // load staring pieces
    for (let piece of Notation.GetPiecesFromFEN(GetConfig().startingFen!)) {
      let nPiece = new Piece(this.boardElement, { file: piece.location.file, rank: piece.location.rank }, piece.color, piece.type);
      Field.GetField({ file: piece.location.file, rank: piece.location.rank })?.SetPiece(nPiece);
    }

    window.onresize = () => {
      for (let f = BOARD_SIZE; f > 0; f--) for (let r = 1; r <= BOARD_SIZE; r++) Field.GetField({ file: f, rank: r })?.GetPiece()?.UpdatePiecePosition();
    };
  }

  FlipBoardToSide(side: PieceColor): void {
    if ((side == PieceColor.WHITE && this.shownSide != PieceColor.WHITE) || (side == PieceColor.BLACK && this.shownSide != PieceColor.BLACK)) {
      for (let f = 1; f <= BOARD_SIZE; f++) for (let r = 1; r <= BOARD_SIZE; r++) Field.GetField({ file: f, rank: r })?.UpdateFieldPosition({ file: 1 + (8 - f), rank: 1 + (8 - r) });
      this.shownSide = side;
    }
  }

  static SetFieldDisplayMode(mode: FieldDisplayMode): void {
    for (let f = BOARD_SIZE; f > 0; f--) for (let r = 1; r <= BOARD_SIZE; r++) Field.GetField({ file: f, rank: r })?.SetDisplayMode(mode);
  }
}

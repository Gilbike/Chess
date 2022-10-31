import { createElement } from "../logic/util";
import { BOARD_SIZE } from "../logic/constants";
import Field from "./Field";
import Piece from "./Piece";
import Notation from "../logic/notation";
import { FieldDisplayMode, GetConfig } from "../logic/config";

export default class Chessboard {
  private boardElement: HTMLElement;
  private gridElement: HTMLElement;

  constructor(element: HTMLElement) {
    this.boardElement = createElement("g-board");
    this.gridElement = createElement("g-fields");
    this.boardElement.append(this.gridElement);
    element.append(this.boardElement);

    // load board
    for (let f = BOARD_SIZE; f > 0; f--) for (let r = 1; r <= BOARD_SIZE; r++) new Field(this.gridElement, { file: f, rank: r }, r % 2 == (f % 2 == 0 ? 1 : 0));

    // load staring pieces
    for (let piece of Notation.GetPiecesFromFEN(GetConfig().startingFen!)) {
      let nPiece = new Piece(this.boardElement, { file: piece.location.file, rank: piece.location.rank }, piece.color, piece.type);
      Field.GetField({ file: piece.location.file, rank: piece.location.rank })?.SetPiece(nPiece);
    }

    window.onresize = () => {
      for (let f = BOARD_SIZE; f > 0; f--) for (let r = 1; r <= BOARD_SIZE; r++) Field.GetField({ file: f, rank: r })?.GetPiece()?.UpdatePiecePosition();
    };
  }

  static SetFieldDisplayMode(mode: FieldDisplayMode): void {
    for (let f = BOARD_SIZE; f > 0; f--) for (let r = 1; r <= BOARD_SIZE; r++) Field.GetField({ file: f, rank: r })?.SetDisplayMode(mode);
  }
}

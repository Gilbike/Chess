import { makeElement } from "./util";
import "./chessboard.css";
import { BOARD_SIZE, defaultFen, PieceColor, PieceType } from "./constants";
import Field from "./Field";
import Piece from "./Piece";
import Notation from "./Notation";
import Rules from "./rules";

export default class Chessboard {
  private boardElement: HTMLElement;
  private gridElement: HTMLElement;

  constructor(element: HTMLElement, config?: ChessConfig) {
    this.boardElement = makeElement("g-board");
    this.gridElement = makeElement("g-fields");
    this.boardElement.append(this.gridElement);
    element.append(this.boardElement);

    // load board
    for (let f = BOARD_SIZE; f > 0; f--) for (let r = 1; r <= BOARD_SIZE; r++) new Field(this.gridElement, { file: f, rank: r }, r % 2 == (f % 2 == 0 ? 1 : 0));

    // load staring pieces
    for (let piece of Notation.GetPiecesFromFEN(config?.startingFen || defaultFen)) {
      let nPiece = new Piece(this.boardElement, { file: piece.location.file, rank: piece.location.rank }, piece.color, piece.type);
      Field.GetField({ file: piece.location.file, rank: piece.location.rank })?.SetPiece(nPiece);
      if (piece.color == PieceColor.WHITE && piece.type == PieceType.KING) Rules.WhiteKing = nPiece;
      else if (piece.color == PieceColor.BLACK && piece.type == PieceType.KING) Rules.BlackKing = nPiece;
    }

    Rules.SetTurningSide(config?.startingSide || PieceColor.WHITE);
  }
}

import { HightlightType, PieceColor, PieceType } from "./constants";
import Field from "./Field";
import Rules from "./rules";
import { getMoveIndex, isMoveInValids, makeElement } from "./util";

export default class Piece {
  private _board: HTMLElement;
  private _dom: HTMLElement;
  private _color: PieceColor;
  private _type: PieceType;
  private _location: Position;
  private _moving: boolean = false;
  private _possibleMoves: ValidMove[] = [];
  private _active: boolean = false;

  constructor(board: HTMLElement, location: Position, color: PieceColor, type: PieceType) {
    this._board = board;
    this._location = location;
    this._color = color;
    this._type = type;
    this._dom = makeElement("g-piece", `${this._color}${this._type}`);

    this.UpdatePiecePosition();

    this._dom.onmousedown = (e) => {
      this.StartDrag(e);
    };
    this._dom.onmouseup = (e) => {
      this.StopDrag(e);
    };
    this._dom.onmousemove = (e) => {
      this.WhileDrag(e);
    };

    board.append(this._dom);
  }

  GetCaptured() {
    Field.GetField(this._location)?.SetPiece(null);
    this._dom.remove();
  }

  Activate() {
    this._active = true;
  }

  //#region GETTERS
  public get type() {
    return this._type;
  }

  public get color() {
    return this._color;
  }

  public get location() {
    return this._location;
  }

  public get active() {
    return this._active;
  }
  //#endregion

  private UpdatePiecePosition() {
    const xOffset = (this._location.rank.valueOf() - 1) * (this._board.offsetWidth / 8),
      yOffset = (8 - this._location.file.valueOf()) * (this._board.offsetHeight / 8);
    this._dom.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
  }

  /* DRAG */
  private StartDrag(e: MouseEvent) {
    e.preventDefault();
    this._moving = true;
    this._dom.style.cursor = "grabbing";
    this._dom.style.zIndex = "10";
    this._possibleMoves = Rules.GetValidMovesForPiece(this, true);
    Field.GetField(this.location)?.SetHightlight(HightlightType.Origin);
    Field.MassHighlightField(this._possibleMoves);
  }

  private StopDrag(e: MouseEvent) {
    e.preventDefault();
    this._moving = false;
    this._dom.style.cursor = "";
    this._dom.style.zIndex = "";

    let boardLocation = this._board.getBoundingClientRect();
    const newRank = Math.floor((e.x - boardLocation.left) / (this._board.offsetWidth / 8)) + 1,
      newFile = 8 - Math.floor((e.y - boardLocation.top) / (this._board.offsetHeight / 8));

    const newLocation: Position = { file: newFile, rank: newRank };

    Field.GetField(this.location)?.SetHightlight(HightlightType.None);

    if (isMoveInValids(newLocation, this._possibleMoves)) {
      this.MovePiece(newLocation);
      // castling
      if (this.type == PieceType.KING && this._possibleMoves[getMoveIndex(newLocation, this._possibleMoves)].moveType == HightlightType.Castling && this._location.file == (this.color == PieceColor.WHITE ? 1 : 8)) {
        const row = this.color == PieceColor.WHITE ? 1 : 8;
        const kingSide = this._location.rank == 7;
        if (kingSide) {
          Field.GetField({ file: row, rank: 8 })?.GetPiece()?.MovePiece({ file: row, rank: 6 });
        } else {
          Field.GetField({ file: row, rank: 1 })?.GetPiece()?.MovePiece({ file: row, rank: 4 });
        }
      }
      // pawn promotion
      else if (this.type == PieceType.PAWN) {
        const row = this.color == PieceColor.WHITE ? 8 : 1;
        if (this.location.file == row) {
          this._type = PieceType.QUEEN;
          this._dom.className = this._dom.className.replace("p", "q");
        }
      }

      Rules.NextTurn();
    }

    Field.MassRemoveHighlights(this._possibleMoves);
    this._possibleMoves = [];
    this.UpdatePiecePosition(); // update dom position
  }

  private WhileDrag(e: MouseEvent) {
    e.preventDefault();
    if (!this._moving) return;
    let boardLocation = this._board.getBoundingClientRect();
    const xOffset = e.x - this._dom.offsetWidth / 2 - boardLocation.left,
      yOffset = e.y - this._dom.offsetWidth / 2 - boardLocation.top;
    this._dom.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
  }

  MovePiece(location: Position) {
    this.Activate(); // make the piece active (needed for pawn double step in first round)
    Field.GetField(this.location)?.SetPiece(null); // remove from old field
    this._location = location;

    if (!Field.GetField(this._location)?.IsFieldEmpty()) Field.GetField(this._location)?.GetPiece()?.GetCaptured(); // remove captured piece

    Field.GetField(this._location)?.SetPiece(this); // set new field

    new Audio("./move.mp3").play(); // play move audio
    this.UpdatePiecePosition(); // update dom position
  }
}

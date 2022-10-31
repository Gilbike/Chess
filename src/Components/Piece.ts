import { HightlightType, PieceColor, PieceType } from "../logic/constants";
import Field from "./Field";
import Rules from "../logic/rules";
import { getMoveIndex, getOppositeSide, isMoveInValids, createElement } from "../logic/util";
import Gamebar from "./Gamebar";
import PromotionModal from "./PromotionModal";

export default class Piece {
  private _board: HTMLElement;
  private _dom: HTMLElement;
  private _color: PieceColor;
  private _type: PieceType;
  private _location: Position;
  private _moving: boolean = false;
  private _possibleMoves: ValidMove[] = [];
  private _active: boolean = false;
  private _passantable: boolean = false;

  constructor(board: HTMLElement, location: Position, color: PieceColor, type: PieceType) {
    this._board = board;
    this._location = location;
    this._color = color;
    this._type = type;
    this._dom = createElement("g-piece", `${this._color}${this._type}`);

    this.UpdatePiecePosition();

    // Desktop mouse events
    this._dom.onmousedown = (e) => {
      this.StartDrag(e);
    };
    this._dom.onmouseup = (e) => {
      this.StopDrag(e);
    };
    this._dom.onmousemove = (e) => {
      this.WhileDrag(e);
    };

    // Mobile touch events
    this._dom.ontouchstart = (e) => {
      this.StartDrag(e);
    };
    this._dom.ontouchend = (e) => {
      this.StopDrag(e);
    };
    this._dom.ontouchmove = (e) => {
      this.WhileDrag(e);
    };

    board.append(this._dom);
  }

  //#region PUBLIC_METHODS
  /**
   * Tell the piece to get off the board
   */
  GetCaptured(): void {
    Field.GetField(this._location)?.SetPiece(null);
    this._dom.remove();
  }

  /**
   * Activate the piece (it made its first move)
   */
  Activate(): void {
    this._active = true;
  }

  RemovePassantable(): void {
    this._passantable = false;
  }

  /**
   * Update the position on the board of the piece
   */
  UpdatePiecePosition(): void {
    const xOffset = (this._location.rank.valueOf() - 1) * (this._board.offsetWidth / 8),
      yOffset = (8 - this._location.file.valueOf()) * (this._board.offsetHeight / 8);
    this._dom.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
  }

  /**
   * Move the piece to a location
   * @param location The new position for the piece
   */
  MovePiece(location: Position): void {
    this.Activate(); // Make the piece active (needed for pawn double step in first round)
    Field.GetField(this.location)?.SetPiece(null); // Remove from old field
    this._location = location;

    if (!Field.GetField(this._location)?.IsFieldEmpty()) {
      Gamebar.AddKnockedPiece(getOppositeSide(this._color), Field.GetField(this._location)!.GetPiece()!.type);
      Field.GetField(this._location)?.GetPiece()?.GetCaptured(); // Remove captured piece
    }

    Field.GetField(this._location)?.SetPiece(this); // Set new field

    new Audio("assets/move.mp3").play(); // Play move audio
    this.UpdatePiecePosition(); // Update DOM position
  }
  //#endregion

  //#region GETTERS
  public get color() {
    return this._color;
  }
  public get type() {
    return this._type;
  }
  public get location() {
    return this._location;
  }
  public get active() {
    return this._active;
  }
  public get passantable() {
    return this._passantable;
  }
  //#endregion

  //#region PIECE_MOVEMENT
  private touchX = 0; // Saved position of the piece because of touch control
  private touchY = 0; // Saved position of the piece because of touch control
  private StartDrag(e: MouseEvent | TouchEvent): void {
    e.preventDefault();
    this._moving = true;
    this._dom.style.cursor = "grabbing";
    this._dom.style.zIndex = "10";
    this._possibleMoves = Rules.GetValidMovesForPiece(this, true);
    Field.GetField(this.location)?.SetHightlight(HightlightType.Origin);
    Field.MassHighlightField(this._possibleMoves);
  }

  private StopDrag(e: MouseEvent | TouchEvent): void {
    e.preventDefault();
    this._moving = false;
    this._dom.style.cursor = "";
    this._dom.style.zIndex = "";
    const eX = e.type == "mouseup" ? (e as MouseEvent).x : this.touchX;
    const eY = e.type == "mouseup" ? (e as MouseEvent).y : this.touchY;

    let boardLocation = this._board.getBoundingClientRect();
    const newRank = Math.floor((eX - boardLocation.left) / (this._board.offsetWidth / 8)) + 1,
      newFile = 8 - Math.floor((eY - boardLocation.top) / (this._board.offsetHeight / 8));

    const newLocation: Position = { file: newFile, rank: newRank };

    Field.GetField(this.location)?.SetHightlight(HightlightType.None);

    if (isMoveInValids(newLocation, this._possibleMoves)) {
      if (!this.active && !this.passantable && Math.abs(this.location.file.valueOf() - newLocation.file.valueOf()) == 2 /* Only enables passinting if it moved 2 fields vertically */) {
        this._passantable = true;
      } else if (this.active && this.passantable) {
        this._passantable = false;
      }
      // Castling
      if (this.type == PieceType.KING && this._possibleMoves[getMoveIndex(newLocation, this._possibleMoves)].moveType == HightlightType.Castling && this._location.file == (this.color == PieceColor.WHITE ? 1 : 8)) {
        const row = this.color == PieceColor.WHITE ? 1 : 8;
        const kingSide = newLocation.rank == 7;
        if (kingSide) {
          Field.GetField({ file: row, rank: 8 })?.GetPiece()?.MovePiece({ file: row, rank: 6 }); // Move the rook
        } else {
          Field.GetField({ file: row, rank: 1 })?.GetPiece()?.MovePiece({ file: row, rank: 4 }); // Move the rook
        }
      }
      // Pawn promotion
      else if (this.type == PieceType.PAWN) {
        const row = this.color == PieceColor.WHITE ? 8 : 1;
        if (this.location.file == row) {
          const modal = new PromotionModal();
          modal.ShowModal();
          modal.Bind((type: PieceType) => {
            this._type = type;
            this._dom.className = this._dom.className.replace("p", type);
          });
        }
      }
      if (this._possibleMoves[getMoveIndex(newLocation, this._possibleMoves)].moveType == HightlightType.Passant) {
        const fileDirection = this.color == PieceColor.BLACK ? 1 : -1; // Reverse the direction if the piece is BLACK
        const knockedPiece = Field.GetField({ file: newLocation.file.valueOf() + fileDirection, rank: newLocation.rank })?.GetPiece();
        Gamebar.AddKnockedPiece(getOppositeSide(this._color), knockedPiece!.type);
        knockedPiece!.GetCaptured();
      }

      this.MovePiece(newLocation); // Move piece to its new location
      Rules.NextTurn(); // Call next turn
    }

    Field.MassRemoveHighlights(this._possibleMoves);
    this._possibleMoves = [];
    this.UpdatePiecePosition(); // update dom position
  }

  private WhileDrag(e: MouseEvent | TouchEvent): void {
    e.preventDefault();
    if (!this._moving) return;
    const eX = e.type == "mousemove" ? (e as MouseEvent).x : (e as TouchEvent).touches[0].clientX;
    const eY = e.type == "mousemove" ? (e as MouseEvent).y : (e as TouchEvent).touches[0].clientY;
    // Save position because of touch control
    if (e.type == "touchmove") {
      this.touchX = eX;
      this.touchY = eY;
    }
    let boardLocation = this._board.getBoundingClientRect();
    const xOffset = eX - this._dom.offsetWidth / 2 - boardLocation.left,
      yOffset = eY - this._dom.offsetWidth / 2 - boardLocation.top;
    this._dom.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
  }
  //#endregion
}

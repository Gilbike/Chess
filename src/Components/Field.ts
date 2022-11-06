import { HightlightType, RANK_NAMES } from "../logic/constants";
import Piece from "./Piece";
import { createElement } from "../logic/util";
import { FieldDisplayMode } from "../logic/config";

export default class Field {
  private dom: HTMLElement;
  private location: Position;
  private piece: Piece | null = null;
  private highlight: HightlightType = HightlightType.None;

  constructor(board: HTMLElement, location: Position) {
    this.dom = createElement(location.rank.valueOf() % 2 == (location.file.valueOf() % 2 == 0 ? 1 : 0) ? "g-light-tile" : "g-dark-tile");
    this.dom.innerText = `${location.file == 1 ? RANK_NAMES[location.rank.valueOf() - 1] : ""}${location.rank == 1 ? location.file : ""}`;
    this.location = location;
    board.append(this.dom);
    Field.fields.push(this);
  }

  //#region PUBLIC_METHODS
  IsFieldEmpty(): boolean {
    return this.piece == null;
  }

  GetPiece(): Piece | null {
    return this.piece;
  }

  SetPiece(piece: Piece | null): void {
    this.piece = piece;
  }

  SetHightlight(type: HightlightType): void {
    this.highlight = type;
    switch (this.highlight) {
      case HightlightType.PossibleMove:
        this.dom.className = "highlighted possible";
        break;
      case HightlightType.Capture:
        this.dom.className = "highlighted capturable";
        break;
      case HightlightType.Passant:
        this.dom.className = "highlighted capturable";
        break;
      case HightlightType.Check:
        this.dom.className = "highlighted incheck";
        break;
      case HightlightType.Origin:
        this.dom.className = "highlighted origin";
        break;
      case HightlightType.Castling:
        this.dom.className = "highlighted possible castling";
        break;
      default:
        this.dom.removeAttribute("class");
        break;
    }
  }

  SetDisplayMode(mode: FieldDisplayMode): void {
    switch (mode) {
      case FieldDisplayMode.ColumnsAndRows:
        this.dom.innerText = `${this.location.file == 1 ? RANK_NAMES[this.location.rank.valueOf() - 1] : ""}${this.location.rank == 1 ? this.location.file : ""}`;
        break;
      case FieldDisplayMode.Every:
        this.dom.innerText = `${RANK_NAMES[this.location.rank.valueOf() - 1]}${this.location.file}`;
        break;
      default:
        this.dom.innerText = ``;
        break;
    }
  }

  UpdateFieldPosition(location: Position) {
    this.location = location;
    this.SetDisplayMode(FieldDisplayMode.Every);
    this.GetPiece()?.SetPiecePosition(this.location);
  }
  //#endregion

  //#region STATIC_METHODS
  private static fields: Field[] = []; // All of the fields
  static GetField(location: Position): Field | null {
    for (let field of Field.fields) {
      if (field.location.file == location.file && field.location.rank == location.rank) return field;
    }
    return null;
  }

  static MassHighlightField(fields: ValidMove[]): void {
    for (let move of fields) {
      this.GetField(move.location)?.SetHightlight(move.moveType);
    }
  }

  static MassRemoveHighlights(fields: ValidMove[]): void {
    for (let move of fields) {
      this.GetField(move.location)?.SetHightlight(HightlightType.None);
    }
  }

  static DestroyFields(): void {
    this.fields = [];
  }
  //#endregion
}

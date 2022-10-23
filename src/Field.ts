import { HightlightType } from "./constants";
import Piece from "./Piece";
import { makeElement } from "./util";

export default class Field {
  private dom: HTMLElement;
  private location: Position;
  private piece: Piece | null = null;
  private highlight: HightlightType = HightlightType.None;

  constructor(board: HTMLElement, location: Position, isLight: boolean) {
    this.dom = makeElement(isLight ? "g-light-tile" : "g-dark-tile");
    this.location = location;
    board.append(this.dom);
    Field.fields.push(this);
  }

  IsFieldEmpty(): boolean {
    return this.piece == null;
  }
  GetPiece(): Piece | null {
    return this.piece;
  }
  SetPiece(piece: Piece | null) {
    this.piece = piece;
  }
  SetHightlight(type: HightlightType) {
    this.highlight = type;
    switch (this.highlight) {
      case HightlightType.PossibleMove:
        this.dom.className = "highlighted possible";
        break;
      case HightlightType.Capture:
        this.dom.className = "highlighted capturable";
        break;
      case HightlightType.Check:
        this.dom.className = "highlighted incheck";
        break;
      case HightlightType.Origin:
        this.dom.className = "highlighted origin";
        break;
      default:
        this.dom.className = "";
        break;
    }
  }

  private static fields: Field[] = [];
  static GetField(location: Position): Field | null {
    for (let field of Field.fields) {
      if (field.location.file == location.file && field.location.rank == location.rank) return field;
    }
    return null;
  }
  static MassHighlightField(fields: ValidMove[]): void {
    for (let move of fields) {
      Field.GetField(move.location)?.SetHightlight(move.moveType);
    }
  }
  static MassRemoveHighlights(fields: ValidMove[]): void {
    for (let move of fields) {
      Field.GetField(move.location)?.SetHightlight(HightlightType.None);
    }
  }
}

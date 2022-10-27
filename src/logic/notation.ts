import { PieceColor, PieceType, RANK_NAMES } from "./constants";
import Rules from "./rules";
import { getOppositeSide } from "./util";

export default class Notation {
  /**
   * @param fen FEN string
   * @returns The pieces that are fetched from the string
   */
  static GetPiecesFromFEN(fen: string): ParsedFEN[] {
    const pieces: ParsedFEN[] = [];

    // parse
    const rows = fen.split("/");
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].split("");
      let colCounter = 0;
      for (let j = 0; j < row.length; j++) {
        let number = parseInt(row[j]);
        if (!isNaN(number)) {
          colCounter += number;
          continue;
        }
        pieces.push({ location: { file: 8 - i, rank: colCounter + 1 }, color: row[j].toLowerCase() == row[j] ? PieceColor.BLACK : PieceColor.WHITE, type: (PieceType as any)[Object.keys(PieceType)[Object.values(PieceType).indexOf(row[j].toLowerCase() as unknown as PieceType)]] });
        colCounter++;
      }
    }

    return pieces;
  }

  static NotateMove(color: PieceColor, type: PieceType, oldLocation: Position, location: Position, knocked: boolean = false, castleType: number = 0): void {
    let NotationString = "";

    NotationString += type == PieceType.PAWN ? (knocked ? RANK_NAMES[oldLocation.rank.valueOf() - 1] : "") : type.toUpperCase();
    if (knocked) NotationString += "x";
    NotationString += `${RANK_NAMES[location.rank.valueOf() - 1]}${location.file}`;

    if (castleType > 0) {
      NotationString = "0-0";
      if (castleType > 1) {
        NotationString += "-0";
      }
    }

    if (Rules.IsInCheck(getOppositeSide(color))) {
      NotationString += "+";
    }

    console.log(NotationString);
  }
}

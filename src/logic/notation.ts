import { PieceColor, PieceType } from "./constants";

export default class Notation {
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
}

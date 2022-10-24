import { BOARD_SIZE, PieceColor, PieceType } from "./constants";
import Field from "../Components/Field";
import Piece from "../Components/Piece";

export function makeElement(name: string, classname?: string): HTMLElement {
  const element = document.createElement(name);
  if (classname) element.className = classname;
  return element;
}

export function isMoveInValids(newLocation: Position, moves: ValidMove[]): boolean {
  for (let move of moves) {
    if (move.location.file == newLocation.file && move.location.rank == newLocation.rank) return true;
  }
  return false;
}

export function getOppositeSide(side: PieceColor): PieceColor {
  if (side == PieceColor.BLACK) return PieceColor.WHITE;
  else if (side == PieceColor.WHITE) return PieceColor.BLACK;
  return PieceColor.WHITE;
}

export function getSidePieces(side: PieceColor): Piece[] {
  const pieces: Piece[] = [];
  for (let f = BOARD_SIZE; f > 0; f--)
    for (let r = 1; r <= BOARD_SIZE; r++) {
      if (!Field.GetField({ file: f, rank: r })?.IsFieldEmpty() && Field.GetField({ file: f, rank: r })!.GetPiece()!.color == side) pieces.push(Field.GetField({ file: f, rank: r })!.GetPiece()!);
    }
  return pieces;
}

export function findKingLocation(side: PieceColor): Position | null {
  for (let f = BOARD_SIZE; f > 0; f--)
    for (let r = 1; r <= BOARD_SIZE; r++) {
      if (!Field.GetField({ file: f, rank: r })?.IsFieldEmpty() && Field.GetField({ file: f, rank: r })!.GetPiece()!.color == side && Field.GetField({ file: f, rank: r })!.GetPiece()!.type == PieceType.KING) {
        return { file: f, rank: r };
      }
    }
  return null;
}

export function getMoveIndex(newLocation: Position, moves: ValidMove[]): number {
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    if (move.location.file == newLocation.file && move.location.rank == newLocation.rank) return i;
  }
  return -1;
}

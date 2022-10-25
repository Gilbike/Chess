import { BOARD_SIZE, PieceColor, PieceType } from "./constants";
import Field from "../Components/Field";
import Piece from "../Components/Piece";

/**
 * @param name Type of the element e.g. div, img, g-board
 * @param classname CSS classname that is assigned immediately
 * @returns The created element
 */
export function createElement(name: string, classname?: string): HTMLElement {
  const element = document.createElement(name);
  if (classname) element.className = classname;
  return element;
}

/**
 * Return if a move is in the valid moves array
 * @param newLocation The position where the piece wants to move to
 * @param moves The valid moves where it can actually go
 * @returns A boolean wheter the move is in the array
 */
export function isMoveInValids(newLocation: Position, moves: ValidMove[]): boolean {
  for (let move of moves) {
    if (move.location.file == newLocation.file && move.location.rank == newLocation.rank) return true;
  }
  return false;
}

/**
 * @param side The side we want to get the opposite of
 * @returns The opposite of side the specified side
 */
export function getOppositeSide(side: PieceColor): PieceColor {
  if (side == PieceColor.BLACK) return PieceColor.WHITE;
  else if (side == PieceColor.WHITE) return PieceColor.BLACK;
  return PieceColor.WHITE;
}

/**
 * @param side The side we want to the get the pieces from
 * @returns The pieces of the side
 */
export function getSidePieces(side: PieceColor): Piece[] {
  const pieces: Piece[] = [];
  for (let f = BOARD_SIZE; f > 0; f--)
    for (let r = 1; r <= BOARD_SIZE; r++) {
      if (!Field.GetField({ file: f, rank: r })?.IsFieldEmpty() && Field.GetField({ file: f, rank: r })!.GetPiece()!.color == side) pieces.push(Field.GetField({ file: f, rank: r })!.GetPiece()!);
    }
  return pieces;
}

/**
 * Gets the king location /file/rank/
 * @param side The side from where we want to get the king location
 * @returns The location of the king or null if the king cannot be found
 */
export function findKingLocation(side: PieceColor): Position | null {
  for (let f = BOARD_SIZE; f > 0; f--)
    for (let r = 1; r <= BOARD_SIZE; r++) {
      if (!Field.GetField({ file: f, rank: r })?.IsFieldEmpty() && Field.GetField({ file: f, rank: r })!.GetPiece()!.color == side && Field.GetField({ file: f, rank: r })!.GetPiece()!.type == PieceType.KING) {
        return { file: f, rank: r };
      }
    }
  return null;
}

/**
 * Returns the index of the move from the array
 * @param newLocation The location we want to find
 * @param moves The searchable array
 * @returns The index of the move
 */
export function getMoveIndex(newLocation: Position, moves: ValidMove[]): number {
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    if (move.location.file == newLocation.file && move.location.rank == newLocation.rank) return i;
  }
  return -1;
}

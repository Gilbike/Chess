import { findKingLocation, getOppositeSide, getSidePieces, isMoveInValids } from "./util";
import { HightlightType, PieceColor, PieceType, PIECE_BEHAVIOUR } from "./constants";
import EndModal from "../Components/EndModal";
import Gamebar from "../Components/Gamebar";
import Field from "../Components/Field";
import Piece from "../Components/Piece";

export default class Rules {
  static WhosTurn: PieceColor;

  //#region PUBLIC_METHODS
  static NextTurn(): void {
    this.WhosTurn = getOppositeSide(this.WhosTurn); // Switch the turning side

    // Count all moves that can be played
    this.CheckEndGame();

    Gamebar.SetActiveSide(this.WhosTurn); // Switch the active side displaying
  }

  /**
   * Checks and if neccesary it ends the game with stalemate or checkmate
   * @param side The side we want to check
   */
  static CheckEndGame(): void {
    let possibleMoves = 0;
    for (let piece of getSidePieces(this.WhosTurn)) {
      piece.RemovePassantable();
      possibleMoves += this.GetValidMovesForPiece(piece, true, false).length;
    }
    if (possibleMoves == 0) {
      let modal: EndModal;
      if (this.IsInCheck(this.WhosTurn)) {
        // King is in check CHECKMATE
        modal = new EndModal(this.WhosTurn, false);
      } else {
        // King is not in check STALEMATE
        modal = new EndModal(this.WhosTurn, true);
      }
      modal.ShowModal();
      modal.Bind();
    }
  }

  /**
   * Calculates all possible and legal moves for a piece
   * @param piece The piece that wants to move
   * @param checkForCheck Wheter the function should validate if the move puts the king into check
   * @param allowSameColor Allow a piece that is currently not on the turning side to move
   * @returns All the valid and legal moves
   */
  static GetValidMovesForPiece(piece: Piece, checkForCheck: boolean = true, allowSameColor?: boolean): ValidMove[] {
    const valids: ValidMove[] = [];

    // Return empty if the its not the piece's turn
    if (piece.color != this.WhosTurn && !allowSameColor) return [];

    // Get the movement and attack behaiour of the piece
    const PieceData: PieceBehaiourData = PIECE_BEHAVIOUR[piece.type];
    const PieceDirections: Position[] = PieceData.moveDirections;
    const PieceMaxMove = piece.active ? PieceData.maxMove : PieceData.firstMoveMax == undefined ? PieceData.maxMove : PieceData.firstMoveMax; // If the piece is not yet active it can have a different max move amount (pawn)

    // Normal movement and attack
    for (let direction of PieceDirections) {
      const fileDirection = piece.color == PieceColor.BLACK ? -direction.file : direction.file; // Reverse the direction if the piece is black
      const rankDirection = direction.rank;

      let breakOnNextField = false;
      // Loop to max move distance
      for (let offset = 1; offset <= PieceMaxMove; offset++) {
        // New proposed location
        const newLocation = { file: (piece.location.file as number) + offset * (fileDirection as number), rank: (piece.location.rank as number) + offset * (rankDirection as number) };
        let newMoveType = HightlightType.PossibleMove;

        if (breakOnNextField || newLocation.file > 8 || newLocation.rank > 8 || newLocation.file < 1 || newLocation.rank < 1) break;
        if (!Field.GetField(newLocation)?.IsFieldEmpty()) {
          if (Field.GetField(newLocation)?.GetPiece()?.color == piece.color) break; // The piece is blocked by a friendly piece
          // Can attack an enemy piece and does not have any special attack moves (pawn)
          if (Field.GetField(newLocation)?.GetPiece()?.color != piece.color && PieceData.specialAttack == undefined) {
            breakOnNextField = true;
            newMoveType = HightlightType.Capture;
          } else break;
        }
        if (checkForCheck) {
          // If this move puts the king in check or does not solve a check then don't add it
          if (!this.IsMoveValid(piece, newLocation)) break;
        }

        const move: ValidMove = {
          location: newLocation,
          moveType: newMoveType,
        };
        valids.push(move);
      }
    }
    // Special attack directions (pawn)
    if (PieceData.specialAttack != undefined) {
      for (let attack of PieceData.specialAttack) {
        const fileDirection = piece.color == PieceColor.BLACK ? -attack.file : attack.file; // Reverse the direction if the piece is black
        const rankDirection = attack.rank;
        const newLocation = { file: (piece.location.file as number) + (fileDirection as number), rank: (piece.location.rank as number) + (rankDirection as number) };

        if (!Field.GetField(newLocation)?.IsFieldEmpty() && Field.GetField(newLocation)?.GetPiece()?.color != piece.color && newLocation.file <= 8 && newLocation.file >= 1 && newLocation.rank <= 8 && newLocation.rank >= 1) {
          if (checkForCheck) {
            // If this move puts the king in check or does not solve a check then don't add it
            if (!this.IsMoveValid(piece, newLocation)) break;
          }

          const move: ValidMove = {
            location: newLocation,
            moveType: HightlightType.Capture,
          };
          valids.push(move);
        }
      }
    }
    // Special moves for the king (castling)
    if (piece.type == PieceType.KING && checkForCheck) {
      const row = piece.color == PieceColor.WHITE ? 1 : 8;
      const kingSideAvaible = !this.IsInCheck(piece.color) && !piece.active && !Field.GetField({ file: row, rank: 8 })?.IsFieldEmpty() && Field.GetField({ file: row, rank: 8 })?.GetPiece()?.color == piece.color && Field.GetField({ file: row, rank: 8 })?.GetPiece()?.type == PieceType.ROOK && !Field.GetField({ file: row, rank: 8 })?.GetPiece()?.active && Field.GetField({ file: row, rank: 7 })?.IsFieldEmpty() && Field.GetField({ file: row, rank: 6 })?.IsFieldEmpty() && isMoveInValids({ file: row, rank: 6 }, valids);
      const queenSideAvaible = !this.IsInCheck(piece.color) && !piece.active && !Field.GetField({ file: row, rank: 1 })?.IsFieldEmpty() && Field.GetField({ file: row, rank: 1 })?.GetPiece()?.color == piece.color && Field.GetField({ file: row, rank: 1 })?.GetPiece()?.type == PieceType.ROOK && !Field.GetField({ file: row, rank: 1 })?.GetPiece()?.active && Field.GetField({ file: row, rank: 2 })?.IsFieldEmpty() && Field.GetField({ file: row, rank: 3 })?.IsFieldEmpty() && Field.GetField({ file: row, rank: 4 })?.IsFieldEmpty() && isMoveInValids({ file: row, rank: 4 }, valids);
      if (kingSideAvaible) {
        const move: ValidMove = {
          location: { file: row, rank: 7 },
          moveType: HightlightType.Castling,
        };
        valids.push(move);
      }
      if (queenSideAvaible) {
        const move: ValidMove = {
          location: { file: row, rank: 3 },
          moveType: HightlightType.Castling,
        };
        valids.push(move);
      }
    }
    // Special moves for the pawn (En Passant)
    // TODO: Custom passantable figures (for custom game modes)
    if (piece.type == PieceType.PAWN && checkForCheck) {
      const fileDirection = piece.color == PieceColor.BLACK ? -1 : 1; // Reverse the direction if the piece is black
      const leftPiece = Field.GetField({ file: piece.location.file, rank: piece.location.rank.valueOf() - 1 })?.GetPiece();
      const rightPiece = Field.GetField({ file: piece.location.file, rank: piece.location.rank.valueOf() + 1 })?.GetPiece();
      if (leftPiece && leftPiece.passantable && leftPiece?.type == PieceType.PAWN) {
        const move: ValidMove = {
          location: { file: piece.location.file.valueOf() + fileDirection, rank: piece.location.rank.valueOf() - 1 },
          moveType: HightlightType.Passant,
        };
        valids.push(move);
      }
      if (rightPiece && rightPiece.passantable && rightPiece?.type == PieceType.PAWN) {
        const move: ValidMove = {
          location: { file: piece.location.file.valueOf() + fileDirection, rank: piece.location.rank.valueOf() + 1 },
          moveType: HightlightType.Passant,
        };
        valids.push(move);
      }
    }

    return valids;
  }

  /**
   * @param piece The piece that we want to validate
   * @param newLocation Where the piece want to move
   * @returns If the move is possible without the being in check
   */
  private static IsMoveValid(piece: Piece, newLocation: Position): boolean {
    const oldPiece = Field.GetField(newLocation)!.GetPiece(); // Save the piece from the field where we want to simulate

    let result = true;
    // Make the move
    Field.GetField(piece.location)?.SetPiece(null);
    Field.GetField(newLocation)?.SetPiece(piece);

    // Check if the king would still be in danger after the move
    if (this.IsInCheck(piece.color)) result = false;

    // Undo the move
    Field.GetField(piece.location)?.SetPiece(piece);
    Field.GetField(newLocation)?.SetPiece(oldPiece);
    return result;
  }
  //#endregion

  /**
   * @param side The side that's king we want to inspect
   * @returns If the king is in check
   */
  private static IsInCheck(side: PieceColor): boolean {
    const oppositePieces = getSidePieces(getOppositeSide(side));
    for (let oPiece of oppositePieces) {
      const moves = this.GetValidMovesForPiece(oPiece, false, true);
      if (isMoveInValids(findKingLocation(side)!, moves)) {
        return true;
      }
    }
    return false;
  }
}

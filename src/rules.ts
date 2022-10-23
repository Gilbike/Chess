import { HightlightType, PieceColor, PIECE_BEHAVIOUR } from "./constants";
import Field from "./Field";
import Piece from "./Piece";
import { findKingLocation, getOppositeSide, getSidePieces, isMoveInValids } from "./util";

export default class Rules {
  private static _whosTurn: PieceColor;
  static WhiteKing: Piece;
  static BlackKing: Piece;

  static SetTurningSide(side: PieceColor): void {
    Rules._whosTurn = side;
  }
  static NextTurn(): void {
    Rules._whosTurn = getOppositeSide(this._whosTurn);
    let possibleMoves = 0;
    for (let piece of getSidePieces(Rules._whosTurn)) {
      possibleMoves += this.GetValidMovesForPiece(piece, true, false).length;
    }
    if (possibleMoves == 0) {
      if (this.IsInCheck(this._whosTurn)) {
        console.log("checkmate");
      } else {
        console.log("stalemate");
      }
    }
  }

  static GetValidMovesForPiece(piece: Piece, checkForCheck: boolean = true, allowSameColor?: boolean): ValidMove[] {
    const valids: ValidMove[] = [];

    if (!allowSameColor) if (Field.GetField(piece.location)?.IsFieldEmpty() || piece.color != Rules._whosTurn) return [];

    const PieceData: PieceBehaiourData = PIECE_BEHAVIOUR[piece.type];
    const PieceDirections: Position[] = PieceData.moveDirections;
    const PieceMaxMove = piece.active ? PieceData.maxMove : PieceData.firstMoveMax == undefined ? PieceData.maxMove : PieceData.firstMoveMax;

    for (let direction of PieceDirections) {
      const fileDirection = piece.color == PieceColor.BLACK ? -direction.file : direction.file;
      const rankDirection = direction.rank;

      let breakOnNextField = false;
      for (let offset = 1; offset <= PieceMaxMove; offset++) {
        const newLocation = { file: (piece.location.file as number) + offset * (fileDirection as number), rank: (piece.location.rank as number) + offset * (rankDirection as number) };
        let newMoveType = HightlightType.PossibleMove;

        if (breakOnNextField || newLocation.file > 8 || newLocation.rank > 8 || newLocation.file < 1 || newLocation.rank < 1) break;
        if (!Field.GetField(newLocation)?.IsFieldEmpty()) {
          if (Field.GetField(newLocation)?.GetPiece()?.color == piece.color) break;
          if (Field.GetField(newLocation)?.GetPiece()?.color != piece.color && PieceData.specialAttack == undefined) {
            breakOnNextField = true;
            newMoveType = HightlightType.Capture;
          } else break;
        }
        if (checkForCheck) {
          // cant step inside check
          if (!this.IsMoveValid(piece, newLocation)) break;
        }

        const move: ValidMove = {
          location: newLocation,
          moveType: newMoveType,
        };
        valids.push(move);
      }
    }
    if (PieceData.specialAttack != undefined) {
      for (let attack of PieceData.specialAttack) {
        const fileDirection = piece.color == PieceColor.BLACK ? -attack.file : attack.file;
        const rankDirection = attack.rank;
        const newLocation = { file: (piece.location.file as number) + (fileDirection as number), rank: (piece.location.rank as number) + (rankDirection as number) };

        if (!Field.GetField(newLocation)?.IsFieldEmpty() && Field.GetField(newLocation)?.GetPiece()?.color != piece.color && newLocation.file <= 8 && newLocation.file >= 1 && newLocation.rank <= 8 && newLocation.rank >= 1) {
          console.log(newLocation);

          if (checkForCheck) {
            // cant step inside check
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

    return valids;
  }

  private static IsMoveValid(piece: Piece, newLocation: Position): boolean {
    const oppositePieces = getSidePieces(getOppositeSide(piece.color));

    const oldPiece = Field.GetField(newLocation)!.GetPiece();

    let result = true;
    Field.GetField(piece.location)?.SetPiece(null);
    Field.GetField(newLocation)?.SetPiece(piece);

    for (let oPiece of oppositePieces) {
      const moves = this.GetValidMovesForPiece(oPiece, false, true);
      if (isMoveInValids(findKingLocation(piece.color)!, moves)) {
        result = false;
        break;
      }
    }

    Field.GetField(piece.location)?.SetPiece(piece);
    Field.GetField(newLocation)?.SetPiece(oldPiece);
    return result;
  }

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

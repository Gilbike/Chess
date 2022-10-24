import { HightlightType, PieceColor, PieceType, PIECE_BEHAVIOUR } from "./constants";
import Field from "../Components/Field";
import Piece from "../Components/Piece";
import { findKingLocation, getOppositeSide, getSidePieces, isMoveInValids } from "./util";
import Gamebar from "../Components/Gamebar";
import EndModal from "../Components/EndModal";

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
      let modal: EndModal;
      if (this.IsInCheck(this._whosTurn)) {
        modal = new EndModal(this._whosTurn, false);
      } else {
        modal = new EndModal(this._whosTurn, true);
      }
      modal.ShowModal();
      modal.Bind();
    }
    Gamebar.SetActiveSide(this._whosTurn);
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
    if (piece.type == PieceType.KING && checkForCheck) {
      // castling
      const row = piece.color == PieceColor.WHITE ? 1 : 8;
      const kingSideAvaible = !Field.GetField({ file: row, rank: 8 })?.IsFieldEmpty() && Field.GetField({ file: row, rank: 8 })?.GetPiece()?.color == piece.color && Field.GetField({ file: row, rank: 8 })?.GetPiece()?.type == PieceType.ROOK && !Field.GetField({ file: row, rank: 8 })?.GetPiece()?.active && Field.GetField({ file: row, rank: 7 })?.IsFieldEmpty() && Field.GetField({ file: row, rank: 6 })?.IsFieldEmpty() && isMoveInValids({ file: row, rank: 6 }, valids);
      const queenSideAvaible = !Field.GetField({ file: row, rank: 1 })?.IsFieldEmpty() && Field.GetField({ file: row, rank: 1 })?.GetPiece()?.color == piece.color && Field.GetField({ file: row, rank: 1 })?.GetPiece()?.type == PieceType.ROOK && !Field.GetField({ file: row, rank: 1 })?.GetPiece()?.active && Field.GetField({ file: row, rank: 2 })?.IsFieldEmpty() && Field.GetField({ file: row, rank: 3 })?.IsFieldEmpty() && Field.GetField({ file: row, rank: 4 })?.IsFieldEmpty() && isMoveInValids({ file: row, rank: 4 }, valids);
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

    return valids;
  }

  private static IsMoveValid(piece: Piece, newLocation: Position): boolean {
    const oldPiece = Field.GetField(newLocation)!.GetPiece();

    let result = true;
    Field.GetField(piece.location)?.SetPiece(null);
    Field.GetField(newLocation)?.SetPiece(piece);

    const oppositePieces = getSidePieces(getOppositeSide(piece.color));

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

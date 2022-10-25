import { GetConfig, ResetConfig, SetConfig } from "./logic/config";
import Chessboard from "./Components/Chessboard";
import { PieceColor } from "./logic/constants";
import { createElement, getOppositeSide } from "./logic/util";
import Gamebar from "./Components/Gamebar";
import Field from "./Components/Field";
import "./chessboard.css";
import Rules from "./logic/rules";

export default class Chess {
  private _boardContainerDOM: HTMLElement;

  constructor(gameDOM: HTMLElement, config?: ChessGameConfig) {
    // Configure the settings
    ResetConfig();
    SetConfig(config);

    gameDOM.className = "g-game"; // assign custom class to the root div
    // set the tile colors
    document.documentElement.style.setProperty("--dark-tile-color", GetConfig().darkTileColor!);
    document.documentElement.style.setProperty("--light-tile-color", GetConfig().lightTileColor!);

    Field.DestroyFields(); // Delete old fields from last game

    // Create a container for the board and then make the board
    this._boardContainerDOM = createElement("div", "g-board-container");
    console.log(gameDOM.style.height);
    this._boardContainerDOM.style.width = gameDOM.style.height;
    this._boardContainerDOM.style.height = gameDOM.style.height;
    gameDOM.append(this._boardContainerDOM);
    new Chessboard(this._boardContainerDOM);

    // Create the sidebar then display the player names from config
    new Gamebar(gameDOM);
    Gamebar.SetActiveSide(GetConfig().startingSide!);
    Gamebar.SetPlayerName(PieceColor.WHITE, GetConfig().lightPlayerName!);
    Gamebar.SetPlayerName(PieceColor.BLACK, GetConfig().darkPlayerName!);

    // See if the game has to end because of checkmate or stalemate (used for custom FEN)
    Rules.WhosTurn = getOppositeSide(GetConfig().startingSide!);
    Rules.CheckEndGame();
    Rules.WhosTurn = GetConfig().startingSide!;
    Rules.CheckEndGame();

    Rules.WhosTurn = GetConfig().startingSide!;
  }
}

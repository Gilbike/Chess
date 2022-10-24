import { GetConfig, SetConfig } from "./logic/config";
import { makeElement } from "./logic/util";
import Chessboard from "./Components/Chessboard";
import Gamebar from "./Components/Gamebar";
import "./chessboard.css";
import Field from "./Components/Field";

export default class Chess {
  private _boardContainerDOM: HTMLElement;

  constructor(gameDOM: HTMLElement, config?: ChessGameConfig) {
    SetConfig(config);
    gameDOM.className = "g-game";
    document.documentElement.style.setProperty("--dark-tile-color", GetConfig().darkTileColor!);
    document.documentElement.style.setProperty("--light-tile-color", GetConfig().lightTileColor!);

    Field.DestroyFields();

    // board
    this._boardContainerDOM = makeElement("div");
    this._boardContainerDOM.style.width = `${gameDOM.offsetHeight}px`;
    this._boardContainerDOM.style.height = `${gameDOM.offsetHeight}px`;
    gameDOM.append(this._boardContainerDOM);
    new Chessboard(this._boardContainerDOM);

    // game bar
    new Gamebar(gameDOM);
    Gamebar.SetActiveSide(GetConfig().startingSide!);
  }
}

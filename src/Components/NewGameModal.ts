import Chess from "../Chess";
import { PieceColor } from "../logic/constants";
import Modal from "../logic/modal";

export default class NewGameModal extends Modal {
  constructor() {
    super("Új játék");
    this.content = `
    <div style="margin: auto; text-align: center">
      <div class="g-newgame-setting">
        <span>Kezdő <a target="_blank" href="https://www.chess.com/terms/fen-chess">FEN</a>:</span>
        <input id="g-newgame-fen" type="text" placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR" />
      </div>
      <div class="g-newgame-setting">
        <span>Kezdő fél:</span>
        <select name="sides" id="g-newgame-side">
          <option value="light">Világos</option>
          <option value="dark">Sötét</option>
        </select>
      </div>
      <div class="g-newgame-setting">
        <span>Világos játékos neve:</span>
        <input id="g-newgame-lightname" type="text" value="Player1" />
      </div>
      <div class="g-newgame-setting">
        <span>Sötét játékos neve:</span>
        <input id="g-newgame-darkname" type="text" value="Player2" />
      </div>
      <div class="g-newgame-setting">
        <span>Világos mező színe:</span>
        <input id="g-newgame-lightcolor" type="color" value="#e0e0e0" />
      </div>
      <div class="g-newgame-setting">
        <span>Sötét mező színe:</span>
        <input id="g-newgame-darkcolor" type="color" value="#a1887f" />
      </div>
      <div id="g-start-newgame" class="button">Kezdés</div>
    </div>
    `;
  }

  Bind() {
    document.getElementById("g-start-newgame")!.onclick = this.StartGame;
  }

  StartGame() {
    const fenValue = (document.getElementById("g-newgame-fen") as HTMLInputElement).value;
    const sideSelected = (document.getElementById("g-newgame-side") as HTMLSelectElement).selectedIndex;
    const p1Name = (document.getElementById("g-newgame-lightname") as HTMLInputElement).value;
    const p2Name = (document.getElementById("g-newgame-darkname") as HTMLInputElement).value;
    const lightColor = (document.getElementById("g-newgame-lightcolor") as HTMLInputElement).value;
    const darkColor = (document.getElementById("g-newgame-darkcolor") as HTMLInputElement).value;

    const config: ChessGameConfig = {};
    if (fenValue.length > 0) config.startingFen = fenValue;
    if (sideSelected == 0) config.startingSide = PieceColor.WHITE;
    else config.startingSide = PieceColor.BLACK;
    if (p1Name.length > 0) config.lightPlayerName = p1Name;
    if (p2Name.length > 0) config.darkPlayerName = p2Name;
    if (lightColor.length > 0) config.lightTileColor = lightColor;
    if (darkColor.length > 0) config.darkTileColor = darkColor;

    document.getElementsByClassName("g-game")[0].innerHTML = ""; // delete old game
    new Chess(document.getElementsByClassName("g-game")[0] as HTMLElement, config);
    super.DestroyModal();
  }
}

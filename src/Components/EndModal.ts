import { PieceColor } from "../logic/constants";
import Modal from "../logic/modal";
import NewGameModal from "./NewGameModal";

const SideNames = {
  w: "Fehér",
  b: "Fekete",
};

export default class EndModal extends Modal {
  constructor(loserSide: PieceColor, stale: boolean) {
    super("A játéknak vége");
    const endText = stale == true ? "Patt" : SideNames[loserSide] + " sakk-mattot kapott!";
    this.content = `
    <div style="margin: auto; text-align: center">
      <div>${endText}</div>
      <div id="g-end-button" style="margin-top: 10px" class="button">Új játék</div>
    </div>
    `;
  }

  Bind() {
    document.getElementById("g-end-button")!.onclick = this.OnNewGameClick;
  }

  OnNewGameClick() {
    super.DestroyModal();
    const modal = new NewGameModal();
    modal.ShowModal();
    modal.Bind();
  }
}

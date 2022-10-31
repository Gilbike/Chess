import Chessboard from "./Components/Chessboard";
import Modal from "./logic/modal";

export default class SettingsModal extends Modal {
  constructor() {
    super("Beállítások");
    super.closeable = true;
    this.content = `
    <div style="display: flex; flex-direction: column; gap: 5px">
      <div class="g-newgame-setting">
        <span>Mező koordináta mutatása:</span>
        <select id="settings-field-display">
          <option value="none">Sehol</option>
          <option selected value="colandrow">Csak sorok és oszlopok elején</option>
          <option value="every">Minden mezőn</option>
        </select>
      </div>
    </div>
    `;
  }

  Bind() {
    document.getElementById("settings-field-display")!.onchange = this.ChangeDisplayMode;
  }

  private ChangeDisplayMode() {
    Chessboard.SetFieldDisplayMode((document.getElementById("settings-field-display") as HTMLSelectElement).selectedIndex);
  }
}

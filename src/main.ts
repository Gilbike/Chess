import Chess from "./Chess";
import NewGameModal from "./Components/NewGameModal";
import SettingsModal from "./SettingsModal";

// Start game by default with default settings
new Chess(document.getElementById("game") as HTMLElement);

// Add event listener for New Game button
document.getElementById("newgame")!.onclick = (): void => {
  const modal = new NewGameModal();
  modal.ShowModal();
  modal.Bind();
};

// Add event listener for Settings button
document.getElementById("settings")!.onclick = (): void => {
  const modal = new SettingsModal();
  modal.ShowModal();
  modal.Bind();
};

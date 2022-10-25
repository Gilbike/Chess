import Chess from "./Chess";
import NewGameModal from "./Components/NewGameModal";

// Start game by default with default settings
new Chess(document.getElementById("game") as HTMLElement);

// Add event listener for New Game button
document.getElementById("newgame")!.onclick = (): void => {
  const modal = new NewGameModal();
  modal.ShowModal();
  modal.Bind();
};

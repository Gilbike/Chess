import Chess from "./Chess";
import NewGameModal from "./Components/NewGameModal";

document.getElementById("newgame")!.onclick = () => {
  const modal = new NewGameModal();
  modal.ShowModal();
  modal.Bind();
};

new Chess(document.getElementById("game") as HTMLElement);

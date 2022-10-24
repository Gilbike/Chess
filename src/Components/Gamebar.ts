import { PieceColor, PieceType } from "../logic/constants";

const template = `
<div class="g-gamebar">
  <div class="g-gamebar-sidecontainer">
    <div class="g-gamebar-name" id="g-darkname">Duffka Erik Martin Ferenc Józsika Pista</div>
    <div class="g-gamebar-side g-gamebar-dark">
      <img src="assets/pieces/wp.png" alt="" />
      <div id="g-out-wp">0x</div>
      <img src="assets/pieces/wn.png" alt="" />
      <div id="g-out-wn">0x</div>
      <img src="assets/pieces/wb.png" alt="" />
      <div id="g-out-wb">0x</div>
      <img src="assets/pieces/wr.png" alt="" />
      <div id="g-out-wr">0x</div>
      <img src="assets/pieces/wq.png" alt="" />
      <div id="g-out-wq">0x</div>
    </div>
  </div>
  <div class="g-gamebar-sidecontainer">
    <div class="g-gamebar-side g-gamebar-light">
      <img src="assets/pieces/bp.png" alt="" />
      <div id="g-out-bp">0x</div>
      <img src="assets/pieces/bn.png" alt="" />
      <div id="g-out-bn">0x</div>
      <img src="assets/pieces/bb.png" alt="" />
      <div id="g-out-bb">0x</div>
      <img src="assets/pieces/br.png" alt="" />
      <div id="g-out-br">0x</div>
      <img src="assets/pieces/bq.png" alt="" />
      <div id="g-out-bq">0x</div>
    </div>
    <div class="g-gamebar-name" id="g-lightname">Sándor Péter</div>
  </div>
</div>
`;

export default class Gamebar {
  constructor(element: HTMLElement) {
    const container = document.createElement("div");
    container.style.height = `100%`;
    container.innerHTML = template;
    element.append(container);
  }

  static SetActiveSide(side: PieceColor) {
    const className = side == PieceColor.WHITE ? "g-gamebar-side g-gamebar-light" : "g-gamebar-side g-gamebar-dark";
    const oppositeClassName = side == PieceColor.WHITE ? "g-gamebar-side g-gamebar-dark" : "g-gamebar-side g-gamebar-light";
    document.getElementsByClassName(oppositeClassName)[0].className = `${oppositeClassName}`;
    document.getElementsByClassName(className)[0].className = `${className} g-active-side`;
  }

  static AddKnockedPiece(side: PieceColor, type: PieceType) {
    const oldText = document.getElementById(`g-out-${side}${type}`)?.innerText || "0x";
    const newKnocked = parseInt(oldText.replace("x", "")) + 1;
    document.getElementById(`g-out-${side}${type}`)!.innerText = `${newKnocked}x`;
  }

  static SetPlayerName(side: PieceColor, name: string) {
    const elementID = side == PieceColor.WHITE ? "g-lightname" : "g-darkname";
    document.getElementById(elementID)!.innerText = name;
  }
}

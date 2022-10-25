import { createElement } from "./util";

// Base class for the popup windows
export default class Modal {
  content: string = "";
  title: string;

  constructor(title: string) {
    this.title = title;
  }

  ShowModal(): void {
    const _containerDOM = createElement("g-modal");
    document.body.append(_containerDOM);

    const _backgroundDOM = createElement("div", "g-modal-background");
    _containerDOM.append(_backgroundDOM);

    const _modalDOM = createElement("div", "g-modal");
    _modalDOM.innerHTML = `<div class="g-modal-title">${this.title}</div>` + this.content;
    _containerDOM.append(_modalDOM);
  }

  DestroyModal(): void {
    document.getElementsByTagName("g-modal")[0].remove();
  }
}

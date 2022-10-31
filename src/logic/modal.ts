import { createElement } from "./util";

// Base class for the popup windows
export default class Modal {
  content: string = "";
  closeable: boolean = false;
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
    _modalDOM.innerHTML = `<div class="g-modal-title">${this.title}${this.closeable ? "<div class='g-modal-close'>✖</div>" : ""}</div>` + this.content;
    _containerDOM.append(_modalDOM);
    if (this.closeable) (document.getElementsByClassName("g-modal-close")[0] as HTMLElement).onclick = this.DestroyModal;
  }

  DestroyModal(): void {
    document.getElementsByTagName("g-modal")[0].remove();
  }

  Bind(...args: any[]) {}
}

import { makeElement } from "./util";

export default class Modal {
  content: string = "";
  title: string;
  private _containerDOM: HTMLElement | undefined;
  private _backgroundDOM: HTMLElement | undefined;
  private _modalDOM: HTMLElement | undefined;

  constructor(title: string) {
    this.title = title;
  }

  ShowModal() {
    this._containerDOM = makeElement("g-modal");
    document.body.append(this._containerDOM);

    this._backgroundDOM = makeElement("div", "g-modal-background");
    this._containerDOM.append(this._backgroundDOM);

    this._modalDOM = makeElement("div", "g-modal");
    this._modalDOM.innerHTML = `<div class="g-modal-title">${this.title}</div>` + this.content;
    this._containerDOM.append(this._modalDOM);
  }

  DestroyModal() {
    document.getElementsByTagName("g-modal")[0].remove();
  }
}

import {PolymerElement, html} from "@polymer/polymer"
import template from "./app-3d-room-mini.html"

export default class App3dRoomMini extends Mixin(PolymerElement)
  .with(EventInterface) {

  static get template() {
    return html([template]);
  }

  static get properties() {
    return {
      height : {
        type : Number,
        value : 100,
        observer : '_heightObserver'
      },
      width : {
        type : Number,
        value : 100,
        observer : '_widthObserver'
      }
    }
  }

  constructor() {
    super();
    this._injectModel('LocationModel');
  }

  _heightObserver() {
    this.style.height = this.height+'px';
  }

  _widthObserver() {
    this.style.width = this.width+'px';
  }

  _onSceneUpdate(scene) {
    this.style.backgroundImage = 'url("/assets/dams/'+scene.data.filename+'")';
  }


}

customElements.define('app-3d-room-mini', App3dRoomMini);
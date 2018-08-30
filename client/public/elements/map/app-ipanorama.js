import {PolymerElement, html} from "@polymer/polymer"
import template from "./app-ipanorama.html"
import {LightDom} from  "@ucd-lib/cork-app-utils"

import config from "../../lib/config"
import ipanoramaTransform from "../../lib/lib/ipanorama-transform"

console.log(LightDom)
export default class AppIpanorama extends Mixin(PolymerElement)
  .with(EventInterface, LightDom) {

  static get template() {
    return html([template]);
  }

  constructor() {
    super();
    this._injectModel('LocationModel');
  }

  connectedCallback() {
    super.connectedCallback();

    if( this._init ) return;
    this._init = true;

    // this.shadowRoot.removeChild(this.$.root);
    // document.querySelector('#ipanorama').appendChild(this.$.root);

    requestAnimationFrame(() => {
      this.LocationModel.init(this, ipanoramaTransform(config.scenes.scenes));
    });
  }
}

customElements.define('app-ipanorama', AppIpanorama);
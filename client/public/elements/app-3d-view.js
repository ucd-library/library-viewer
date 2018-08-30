import {PolymerElement, html} from "@polymer/polymer"
import template from "./app-3d-view.html"

import {LightDom} from  "@ucd-lib/cork-app-utils"

import "./map/app-library-map"
import "./map/app-ipanorama"

import jslib from "../lib"
window.app = jslib;

export default class App3dView extends Mixin(PolymerElement)
  .with(LightDom) {

  static get template() {
    return html([template]);
  }

  static get properties() {
    return {
      
    }
  }

}

customElements.define('app-3d-view', App3dView);
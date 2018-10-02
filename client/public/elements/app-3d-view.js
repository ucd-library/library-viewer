import {PolymerElement, html} from "@polymer/polymer"
import template from "./app-3d-view.html"

import {LightDom} from  "@ucd-lib/cork-app-utils"

import "./map/app-library-map"
import "./map/app-library-mini-map"
import "./3d-view/app-ipanorama"
import "./3d-view/app-3d-room-mini"

import jslib from "../lib"
window.app = jslib;

export default class App3dView extends Mixin(PolymerElement)
  .with(LightDom) {

  static get template() {
    return html([template]);
  }

  static get properties() {
    return {
      showingMap : {
        type : Boolean,
        value : false
      }    
    }
  }

  _toggle() {
    this.showingMap = !this.showingMap;
    if( this.showingMap ) this.$.map.onResize();
    else this.$.ipanorama.onResize();
  }

}

customElements.define('app-3d-view', App3dView);
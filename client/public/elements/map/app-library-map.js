import {PolymerElement, html} from "@polymer/polymer"
import template from "./app-library-map.html"
import "@polymer/polymer/lib/elements/dom-repeat"

import leaflet from "leaflet"
import leafletCss from "leaflet/dist/leaflet.css"

export default class AppLibraryMap extends Mixin(PolymerElement)
  .with(EventInterface) {

  static get template() {
    let tag = document.createElement('template');
    tag.innerHTML = `<style>${leafletCss}</style>${template}`;
    return tag;
  }

  static get properties() {
    return {
      floors : {
        type : Array,
        value : () => []
      },
      floorPath : {
        type : String,
        value : ''
      },
      floorScenes : {
        type : Array,
        value : []
      },
      positionX : {
        type : Number,
        value : 0
      },
      positionY : {
        type : Number,
        value : 0
      },
      showCurrentPos : {
        type : Boolean,
        value : false
      }
    }
  }

  constructor() {
    super();

    this._injectModel('LocationModel');
  }

  ready() {
    super.ready();

    let floors = [];
    for( let label in this.LocationModel.store.data.floors ) {
      let f = this.LocationModel.store.data.floors[label];

      // TODO: add current floor?
      floors.push({
        label, 
        image : f.image,
        scenes : f.scenes,
        selected: false,
        current: false
      });
    }
    floors[0].selected = true;
    this.floors = floors;
  }

  _onSceneUpdate(scene) {
    this.currentScene = scene;
    this.currentFloor = scene.floor.id;

    for( let i = 0; i < this.floors.length; i++ ) {
      this._selectFloor(i, this.floors[i].label === scene.floor.id);
      this.set(`floors.${i}.current`, this.floors[i].label === scene.floor.id);
    }
    
    this.positionX = scene.data.coordinate[0];
    this.positionY = scene.data.coordinate[1];
    this.showCurrentPos = true;
  }

  renderPosMarker() {
    if( !this.res || !this.viewer ) return;
    
    if( this.currentPosMarker ) {
      this.viewer.removeLayer(this.currentPosMarker);
    }

    if( !this.showCurrentPos ) return;

    let icon = L.divIcon({ 
      iconSize: new L.Point(8, 8), 
      html: `<div style="position: relative" data-x="${this.positionX}" data-y="${this.positionY}">
      <div class="ring"></div>
      <div class="marker"></div>
    </div>`,
      className : 'position'
    });

    this.currentPosMarker = L.marker([this.res[0]-this.positionY, this.positionX], {icon}).addTo(this.viewer)
    this.viewer.panTo([this.res[0]-this.positionY, this.positionX]);
  }

  async _selectFloor(index, selected) {
    this.set(`floors.${index}.selected`, selected);
    if( selected ) {
      this.floorPath = '/assets/dams/'+this.floors[index].image;
      this.floorScenes = this.floors[index].scenes;

      await this._loadImage(this.floorPath);

      if( !this.viewer ) {
        this.viewer = L.map(this.$.viewer, {
          crs: L.CRS.Simple,
          minZoom: -4,
          // dragging :  !L.Browser.mobile,
          // scrollWheelZoom : false,
          touchZoom : true,
          zoomControl : true
        });
      }

      if( this.imageOverlay ) {
        this.viewer.removeLayer(this.imageOverlay);
      }

      this.imageOverlay = L.imageOverlay(this.floorPath, this.bounds).addTo(this.viewer);
      this.viewer.setView([this.res[0]/2, this.res[1]/2], 0);

      if( this.divIcons ) {
        this.divIcons.forEach(i => this.viewer.removeLayer(i));
      }
      this.divIcons = [];
      this.floorScenes.forEach((item, index) => {
        let icon = L.divIcon({ 
          iconSize: new L.Point(8, 8), 
          html: `<span index="${index}"><span>`,
          className : 'scene-pt'
        });
        this.divIcons.push(
          L.marker([this.res[0]-item.y, item.x], {icon})
            .on('click', e => this._onScenePtClicked(e.target._icon.firstChild))
            .addTo(this.viewer)
        )
      });

      this.renderPosMarker();
      // this.viewer.fitBounds(this.bounds);
    }
  }

  /**
   * @method _loadImage
   * @description preload image and set bounds to image dimensions
   * 
   * @param {String} url url of image to load
   * 
   * @returns {Promise} resolves when image is loaded and bounds array has been set
   */
  _loadImage(url) {
    this.loading = true;

    return new Promise((resolve, reject) => {
      var img = new Image();
      img.onload = () => {
        this.res = [img.naturalHeight, img.naturalWidth];
        this.bounds = [[0,0], this.res];
        this.loading = false;

        this.renderPosMarker();
        resolve();
      };
      img.src = url;
    });
  }

  _showFloor(e) {
    let index = parseInt(e.currentTarget.getAttribute('index'));
    for( let i = 0; i < this.floors.length; i++ ) {
      this._selectFloor(i, (i === index));
    }

    console.log(this.floors[index], this.currentFloor);
    this.showCurrentPos = (this.floors[index].label === this.currentFloor);
    this.renderPosMarker();
  }

  _onScenePtClicked(ele) {
    let index = parseInt(ele.getAttribute('index'));
    let scene = this.floorScenes[index];
    this.LocationModel.setScene(scene.id);
  }

  onResize() {
    setTimeout(() => { this.viewer.invalidateSize() }, 100);
  }

  _fireSwitch() {
    this.fire('switch')
  }

}

customElements.define('app-library-map', AppLibraryMap);
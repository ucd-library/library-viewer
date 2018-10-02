import {PolymerElement, html} from "@polymer/polymer"
import template from "./app-library-mini-map.html"

export default class AppLibraryMiniMap extends Mixin(PolymerElement)
  .with(EventInterface) {

  static get template() {
    return html([template]);
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
      },
      height: {
        type : Number,
        value : 100,
        observer : '_heightObserver'
      },
      width: {
        type : Number,
        value : 100,
        observer : '_widthObserver'
      },
      offset: {
        type : Object,
        value : () => ({x:0,y:0}),
        observer : '_offsetObserver'
      },
      scale: {
        type : Number,
        value : 0.40,
        observer : '_scaleObserver'
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

      floors.push({
        label, 
        image : f.image,
        scenes : f.scenes.map(s => {
          s = Object.assign({}, s);
          s.x = (this.scale * s.x) - 4;
          s.y = (this.scale * s.y) - 4;
          return s;
        }),
        selected: false,
        current: false
      });
    }
    floors[0].selected = true;
    this.floors = floors;

    this._offsetObserver();
    this._scaleObserver();
  }

  _onSceneUpdate(scene) {
    this.currentScene = scene;
    this.currentFloor = scene.floor.id;

    for( let i = 0; i < this.floors.length; i++ ) {
      this._selectFloor(i, this.floors[i].label === scene.floor.id);
      this.set(`floors.${i}.current`, this.floors[i].label === scene.floor.id);
    }
    
    this.positionX = (scene.data.coordinate[0] * this.scale) - 4;
    this.positionY = (scene.data.coordinate[1] * this.scale) - 4;
  
    this.offset = {
      x : this.positionX - (this.width / 2),
      y : this.positionY - (this.height / 2)
    }
  }

  async _selectFloor(index, selected) {
    this.set(`floors.${index}.selected`, selected);
    if( selected ) {
      this.floorPath = '/assets/dams/'+this.floors[index].image;
      this.floorScenes = this.floors[index].scenes;
      
      this.floorSize = await this._getImageSize(this.floorPath);
      this._scaleObserver();
    }
  }

  /**
   * @method _getImageSize
   * @description preload image and set bounds to image dimensions
   * 
   * @param {String} url url of image to load
   * 
   * @returns {Promise} resolves when image is loaded and bounds array has been set
   */
  _getImageSize(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.onload = () => {
        resolve({
          height: img.naturalHeight, 
          width: img.naturalWidth
        });
      }
      img.src = url;
    });
  }

  _heightObserver() {
    this.style.height = this.height+'px';
  }

  _widthObserver() {
    this.style.width = this.width+'px';
  }

  _offsetObserver() {
    if( !this.offset || !this.$ ) return;
    this.$.offset.style.left = (this.offset.x * -1)+'px';
    this.$.offset.style.top = (this.offset.y * -1)+'px';
  }

  _scaleObserver() {
    if( !this.$ || !this.floorSize ) return;
    this.$.floorImg.style.height = (this.floorSize.height * this.scale) + 'px';
    this.$.floorImg.style.width = (this.floorSize.width * this.scale) + 'px';
  }

}

customElements.define('app-library-mini-map', AppLibraryMiniMap);
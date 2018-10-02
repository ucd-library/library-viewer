const {BaseModel} = require('@ucd-lib/cork-app-utils');
const store = require('../stores/LocationStore');
const config = require('../config');
const ipanoramaTransform = require('../lib/ipanorama-transform');

const LABEL_ELEMENT_BASE_ID = 'ipnrm-label-';

class LocationModel extends BaseModel {

  constructor() {
    super();

    this.store = store;

    this.register('LocationModel');
  }

  init(element, ipanoramaConfig) {
    if( typeof window !== 'undefined' ) {
      if( !this.rootLabelsEle ) {
        this.rootLabelsEle = document.createElement('div');
        this.rootLabelsEle.style.display = 'none';
        document.body.appendChild(this.rootLabelsEle);
      } else {
        this.rootLabelsEle.innerHTML = '';
      }
    }


    this.element = element;
    ipanoramaConfig.onCameraUpdate = (y, p, z) => this._onCameraUpdate(y, p, z);
    ipanoramaConfig.onSceneChange = (oid, nid) => this._onSceneChange(oid, nid);
    
    let startSceneId = this.store.data.scene.current;
    if( !startSceneId ) startSceneId = config.scenes.scenes[0].id;
    ipanoramaConfig.sceneId = startSceneId;

    if( typeof window !== 'undefined' ) {
      // first create all our label elements
      
      let c = 0;
      for( let sceneId in ipanoramaConfig.scenes ) {
        let scene = ipanoramaConfig.scenes[sceneId];
        
        scene.titleSelector = '#'+LABEL_ELEMENT_BASE_ID+c;
        this._createLabel(LABEL_ELEMENT_BASE_ID+c, scene.name);
        c++;

        for( let hotSpot of (scene.hotSpots || []) ) {
          hotSpot.popoverSelector = '#'+LABEL_ELEMENT_BASE_ID+c;
          this._createLabel(LABEL_ELEMENT_BASE_ID+c, hotSpot.popover);
          c++;
        }
      }

      $(element).ipanorama(ipanoramaConfig);
      window.ipanorama = $(element);
    }
  }

  _createLabel(id, text) {
    let ele = document.createElement('div');
    ele.id = id;
    ele.innerHTML = text;
    this.rootLabelsEle.appendChild(ele);
  }

  _onCameraUpdate(cameraYaw, cameraPitch, cameraZoom) {
    this.store.setCamera(cameraYaw, cameraPitch, cameraZoom);
  }

  _onSceneChange(oldSceneId, newSceneId) {
    this.store.setScene(oldSceneId, newSceneId);
  }

  /**
   * @method set
   * @description Manually set a scene
   * TODO: for now, recreating widget.  Lookup if there is method
   * to manually set scene.
   * 
   * @param {String} sceneId
   */
  setScene(sceneId) {
    let last = this.store.data.scene.current;
    this.store.data.scene.current = sceneId;
    // this.init(
    //   this.element,
    //   ipanoramaTransform(config.scenes.scenes)
    // );

    $(this.element).ipanorama("loadscene", {sceneId})

    this.store.setScene(last, sceneId);
  }


}

module.exports = new LocationModel();
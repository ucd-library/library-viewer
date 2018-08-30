const {BaseStore} = require('@ucd-lib/cork-app-utils');
const config = require('../config');

class LocationStore extends BaseStore {

  constructor() {
    super();

    this.data = {
      floors : {},
      scenes : {},
      
      scene : {
        last : null,
        current : null,
        floor : {},
        data : {}
      },
      camera : {}
    }
    for( let key in config.scenes.floors ) {
      this.data.floors[key] = {
        id : key,
        image : config.scenes.floors[key],
        scenes : []
      }
    }

    config.scenes.scenes.forEach(s => {
      s.x = s.coordinate[0];
      s.y = s.coordinate[1];
      this.data.scenes[s.id] = s;
      this.data.floors[s.floor].scenes.push(s);
    });

    this.events = {
      CAMERA_UPDATE : 'camera-update',
      SCENE_UPDATE : 'scene-update'
    }
  }

  setScene(oldSceneId, newSceneId) {
    let data = {
      last : oldSceneId,
      current : newSceneId,
      data : this.data.scenes[newSceneId],
      floor : {
        id : this.data.scenes[newSceneId].floor,
        image : this.data.floors[this.data.scenes[newSceneId].floor]
      }
    }

    this.data.scene = data;
    this.emit(this.events.SCENE_UPDATE, data);
  }

  getScene() {
    return this.data.scene;
  }

  setCamera(yaw, pitch, zoom) {
    this.data.camera = {yaw, pitch, zoom};
    this.emit(this.events.CAMERA_UPDATE)
  }

  getCamera() {
    return this.data.camera;
  }

}

module.exports = new LocationStore();
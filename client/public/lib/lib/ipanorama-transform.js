const clone = require('clone');

/**
 * Transform app config file to ipanorama config
 */

let sceneDefaults = {
  type : 'sphere',
  cubeTextureCount: "single",
  sphereWidthSegments: 100,
  sphereHeightSegments: 40,
  saveCamera: true,
  compassNorthOffset: 0,
  titleHtml: false,
  image : ''
}

let hotSpotDefaults = {
  linkNewWindow: false,
  imageUrl: "",
  popoverLazyload: false,
  popoverSelector: "",
  popoverSelectorDetach: true,
  popoverHtml: true,
  popoverShow: false
}

module.exports = (scenes) => {

  let conf = {};

  for( let scene of scenes ) {
    scene = clone(scene);

    Object.assign(scene, sceneDefaults);
    scene.image = '/assets/dams/'+scene.filename;

    for( let hotSpot of (scene.hotSpots || []) ) {
      Object.assign(hotSpot, hotSpotDefaults);
    }

    conf[scene.id] = scene;
  }

  return {
    "theme": "ipnrm-theme-default",
    "autoLoad": true,
    "autoRotate": false,
    "autoRotateSpeed": 0.001,
    "autoRotateInactivityDelay": 3000,
    "mouseWheelPreventDefault": true,
    "mouseWheelRotate": false,
    "mouseWheelRotateCoef": 0.2,
    "mouseWheelZoom": false,
    "mouseWheelZoomCoef": 0.05,
    "hoverGrab": false,
    "hoverGrabYawCoef": 20,
    "hoverGrabPitchCoef": 20,
    "grab": true,
    "grabCoef": 0.1,
    "pinchZoom": true,
    "pinchZoomCoef": 0.1,
    "showControlsOnHover": false,
    "showSceneThumbsCtrl": false,
    "showSceneMenuCtrl": false,
    "showSceneNextPrevCtrl": true,
    "showShareCtrl": false,
    "showZoomCtrl": true,
    "showFullscreenCtrl": true,
    "showAutoRotateCtrl": true,
    "sceneThumbsVertical": true,
    "sceneThumbsStatic": false,
    "title": true,
    "compass": true,
    "keyboardNav": false,
    "keyboardZoom": false,
    "sceneNextPrevLoop": false,
    "popover": true,
    "popoverPlacement": "top",
    "hotSpotBelowPopover": true,
    "popoverShowTrigger": "hover",
    "popoverHideTrigger": "leave",
    "mobile": true,
    "sceneId": "scene2",
    "sceneFadeDuration": 3000,
    "sceneBackgroundLoad": false,
    scenes : conf
  }

}
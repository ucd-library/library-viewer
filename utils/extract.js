function extractConfig(config) {
  for( let key in config.scenes ) {
    let scene = config.scenes[key];
    scene.image = scene.image.replace(/.*\//, '');
    scene.title = document.querySelector(scene.titleSelector).innerHTML;
    for( let hotSpot of (scene.hotSpots || []) ) {
      hotSpot.popover = document.querySelector(hotSpot.popoverSelector).innerHTML;
    }
  }

  console.log(JSON.stringify(config, '  ', '  '));
}
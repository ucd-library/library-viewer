const fs = require('fs-extra');
const path = require('path');
const config = require('./scene-config');

let rootPath = path.join(__dirname, 'rdf');
if( fs.existsSync(rootPath) ) fs.removeSync(rootPath);
fs.mkdirpSync(rootPath);

for( let key in config.scenes ) {
  let scene = config.scenes[key];
  
  let hotSpots = (scene.hotSpots || [])
    .map(s => {
      return {
        yaw : s.yaw,
        pitch : s.pitch,
        sceneId : s.sceneId,
        popover : s.popover
      }
    })
    .map(s => `  fin:libraryMapSceneHotSpot "${JSON.stringify(s).replace(/"/g, '\\"')}" ;`)
    .join('\n');

  let text = `@prefix schema: <http://schema.org/> .
@prefix fin: <http://digital.ucdavis.edu/schema#> .

<> a schema:ImageObject, schema:CreativeWork;
  schema:name "${scene.title}";
  schema:license <http://rightsstatements.org/vocab/InC-NC/1.0/>;
  schema:encodingFormat "image/jpeg";
  schema:datePublished "2018"^^<http://www.w3.org/2001/XMLSchema#date> ;
  fin:libraryMapCoordinate "${scene.position.join(',')}" ;
${hotSpots}
  fin:libraryMapSceneId "${key}" ;
  fin:libraryMapFloor "${scene.level}" .`

   fs.writeFileSync(path.join(rootPath, scene.image+'.ttl'), text);
}
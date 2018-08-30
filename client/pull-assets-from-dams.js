/**
 * populate the /client/public/assets/dams folder from a UCD dams instance
 */
if( process.argv.length < 4) {
  return console.log('Usage: node pull-assets-from-dams.js [dams-host] [collection-name] ')
}

const request = require('request');
const fs = require('fs-extra');
const path = require('path');

const rootDir = path.join(__dirname, 'public', 'assets', 'dams');
const host = process.argv[2];
const collection = process.argv[3];

function _request(uri, opts = {}, json=true) {
  if( json === true ) {
    if( !opts.headers ) opts.headers = {};
    opts.headers.Accept = 'application/ld+json';
  }

  return new Promise((resolve, reject) => {
    request(uri, opts, (error, response) => {
      if( error ) reject(error);
      else resolve(response);
    });
  });
}

(async function(){

  if( !fs.existsSync(rootDir) ) {
    await fs.remove(rootDir);
  }
  await fs.mkdirp(rootDir);

  let rootContainer = `${host}/fcrepo/rest/collection/${collection}`;
  let response = await _request(rootContainer);
  response = JSON.parse(response.body)[0];
  
  let scenes = [];
  let floors = {};

  for( let part of response['http://schema.org/hasPart'] ) {
    let partUri = part['@id'];

    let scene = await _request(partUri+'/fcr:metadata');
    scene = JSON.parse(scene.body)[0];

    let filename = scene['http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#filename'][0]['@value'];
    
    if( partUri.match(/scene/) ) {
      scene = {
        id : scene['http://digital.ucdavis.edu/schema#libraryMapSceneId'][0]['@value'],
        name : scene['http://schema.org/name'][0]['@value'],
        filename : filename,
        floor : scene['http://digital.ucdavis.edu/schema#libraryMapFloor'][0]['@value'],
        coordinate : scene['http://digital.ucdavis.edu/schema#libraryMapCoordinate'][0]['@value'].split(',').map(v => parseInt(v)),
        hotSpots : (scene['http://digital.ucdavis.edu/schema#libraryMapSceneHotSpot'] || [])
                      .map(v => JSON.parse(v['@value'])) 
      }
      scenes.push(scene);
    } else {
      floors[scene['http://digital.ucdavis.edu/schema#libraryMapFloor'][0]['@value']] = filename;
    }

    let image = await _request(partUri, {encoding: null}, false);
    await fs.writeFile(path.join(rootDir, filename), image.body);
  }

  await fs.writeFile(path.join(rootDir, 'scene.json'), JSON.stringify({floors, scenes}, '  ', '  '));
})();

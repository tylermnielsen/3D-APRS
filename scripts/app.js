
// setup 
import { CESIUM_TOKEN, APRS_TOKEN } from "./tokens.js"
import { aprs_get, aprs_get_pos } from "./toolbox.js"

const target_id = "636017434"; // "KI7NNK-9"; 

// api key 
Cesium.Ion.defaultAccessToken = CESIUM_TOKEN; 
let viewer = null; 
let last_pos = null; 
let current_entity = null; 

async function startCesiumApp(id){
  viewer = new Cesium.Viewer('cesiumContainer', {
    terrain: Cesium.Terrain.fromWorldTerrain(), 
  });
  viewer.scene.globe.enableLighting = true;

  const first_pos = await aprs_get_pos(id); 
  console.log("first_pos: ", first_pos); 

  const position = Cesium.Cartesian3.fromDegrees(first_pos.long, first_pos.lat, first_pos.height); 

  const heading = Cesium.Math.toRadians(135);
  const pitch = 0;
  const roll = 0;
  const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
  const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

  const pointEntity = viewer.entities.add({
    description: `(${first_pos.lat}, ${first_pos.long}) @ ${first_pos.alt} m`,
    position: position,
    point: { pixelSize: 10, color: Cesium.Color.YELLOW }
  });

  console.log(pointEntity); 

  current_entity = viewer.entities.add({
    name: "Balloon",
    position: position,
    orientation: orientation, 
    model: {
      uri: "../models/CesiumBalloonKTX2.glb",
      minimumPixelSize: 128,
      maximumScale: 20000, 
    },
  });
  // viewer.trackedEntity = current_entity; 

  // viewer.camera.flyTo({
  //   destination: Cesium.Cartesian3.fromDegrees(first_pos.long, first_pos.lat, (first_pos.alt - ground_alt)), 
  //   orientation: {
  //     heading: Cesium.Math.toRadians(0.0), 
  //     pitch: Cesium.Math.toRadians(-15.0), 
  //   }
  // }); 
  viewer.flyTo(pointEntity); 

  const buildingTileset = await Cesium.createOsmBuildingsAsync(); 
  viewer.scene.primitives.add(buildingTileset); 

  last_pos = first_pos; 


  // start interval 
  setInterval(update, 60 * 1000); 
}

// updater 
async function update() {
  console.log("Update!"); 
  
  const pos = await aprs_get_pos(target_id); 
  console.log("fetched position: ", pos); 

  if(pos.lat == last_pos.lat && pos.long == last_pos.log && pos.alt == last_pos.alt){
    console.log("No Change");
    return; 
  }

  const position = Cesium.Cartesian3.fromDegrees(pos.long, pos.lat, pos.height); 

  const pointEntity = viewer.entities.add({
    description: `(${pos.lat}, ${pos.long}) @ ${pos.alt} m`,
    position: position,
    point: { pixelSize: 10, color: Cesium.Color.YELLOW }
  });

  // const lineBetween = viewer.entities.add({
  //   name: "Purple straight arrow at height",
  //   polyline: {
  //     positions: Cesium.Cartesian3.fromDegreesArrayHeights([
  //       last_pos.long, last_pos.lat, last_pos.height, pos.long, pos.lat, pos.height,
  //     ]),
  //     width: 10,
  //     arcType: Cesium.ArcType.NONE,
  //     material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.PURPLE),
  //   },
  // });

  current_entity.position = position; 

  viewer.flyTo(pointEntity); 

  last_pos = pos; 
}

startCesiumApp(target_id); 

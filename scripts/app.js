
// setup 
import { CESIUM_TOKEN, APRS_TOKEN } from "./tokens.js"
import { aprs_get, aprs_get_pos } from "./toolbox.js"

const target_id = "636021078"; // "KI7NNK-9"; 

// api key 
Cesium.Ion.defaultAccessToken = CESIUM_TOKEN; 

async function startCesiumApp(id){
  const viewer = new Cesium.Viewer('cesiumContainer', {
    terrain: Cesium.Terrain.fromWorldTerrain(), 
  });

  const first_pos = await aprs_get_pos(id); 
  console.log("first_pos: ", first_pos); 

  const pointEntity = viewer.entities.add({
    description: `(${first_pos.lat}, ${first_pos.long}) @ ${first_pos.alt} m`,
    position: Cesium.Cartesian3.fromDegrees(first_pos.long, first_pos.lat, first_pos.height),
    point: { pixelSize: 10, color: Cesium.Color.YELLOW }
  });

  console.log(pointEntity); 

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



  // start interval 
  setInterval(update, 60 * 1000); 
}

// updater 
let last_pos = null; 
async function update() {
  console.log("Update!"); 
  
  const pos = aprs_get_pos(target_id); 

  if(pos == last_pos) return; 

  const pointEntity = viewer.entities.add({
    description: `(${pos.lat}, ${pos.long}) @ ${pos.alt} m`,
    position: Cesium.Cartesian3.fromDegrees(pos.long, pos.lat, pos.alt - ground_alt),
    point: { pixelSize: 10, color: Cesium.Color.YELLOW }
  });

  const lineBetween = viewer.entities.add({
    name: "Purple straight arrow at height",
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        last_pos.long, last_pos.lat, last_pos.height, pos.long, pos.lat, pos.height,
      ]),
      width: 10,
      arcType: Cesium.ArcType.NONE,
      material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.PURPLE),
    },
  });

  viewer.flyTo(pointEntity); 

  last_pos = pos; 
}

startCesiumApp(target_id); 

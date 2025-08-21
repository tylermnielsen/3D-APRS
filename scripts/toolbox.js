import { CESIUM_TOKEN, APRS_TOKEN } from "./tokens.js"

export async function aprs_get(id){

  const url = `https://api.aprs.fi/api/get?name=${id}&what=loc&apikey=${APRS_TOKEN}&format=json`;

  // fetch("https://corsproxy.io/?" + encodeURIComponent(url))
  //   .then(r => r.json())
  //   .then(data => console.log(data))
  //   .catch(err => console.error(err));

  // TODO: add proxy or something maybe 
  return await (await fetch("https://corsproxy.io/?" + encodeURIComponent(url))).json(); 
}

export async function aprs_get_pos(id){
  let result = await aprs_get(id); 

  let res_lat = parseFloat(result.entries[0].lat); 
  let res_long = parseFloat(result.entries[0].lng); 
  let res_alt = result.entries[0].altitude; 
  let res_lasttime = result.entries[0].lasttime * 1000; // * 1000 to work with new Date(milliseconds) 
  let res_time = result.entries[0].time * 1000;
  let height = 0; 

  if(res_alt == null){
    res_alt = 0; 
    height = 0; 
  }
  
  // if(res_alt == null){
  //   res_alt = 1; 
  //   height = 1; 
  // }
  // else {
  //   const terrainProvider = await Cesium.createWorldTerrainAsync(); 
  //   const generic_pos = [
  //     Cesium.Cartographic.fromDegrees(first_pos.long, first_pos.lat, 0)
  //   ]; 

  //   const updatedPositions = await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, generic_pos);
  //   height = res_alt - updatedPositions[0].height; 
  // }
  let res_speed = result.entries[0].speed; 
  let res_course = result.entries[0].course; 

  return {
    "lat": res_lat, 
    "long": res_long,
    "alt": res_alt,
    "height": height, 
    "speed": res_speed, 
    "course": res_course,
    "lasttime": res_lasttime, 
    "time": res_time
  }
}
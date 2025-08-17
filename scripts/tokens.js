export var local_cookies = {}; 

function loadCookies(){
  local_cookies = {}; 
  if(document.cookie != null){
    let cookie_list  = decodeURIComponent(document.cookie).split("; "); 
    for(let i = 0; i < cookie_list.length; i++){
      let pair = cookie_list[i].split("="); 
      local_cookies[pair[0]] = pair[1]; 
    }
  }
  console.log("initial load", local_cookies); 
}

function updateCookies(){
  document.cookie = `aprs_token=${local_cookies["aprs_token"]};`; 
  document.cookie = `cesium_token=${local_cookies["cesium_token"]};`; 
}

loadCookies(); 
console.log(local_cookies); 

export const CESIUM_TOKEN = window.prompt("Enter Cesium API Token:", (local_cookies["cesium_token"] == null)? "" : local_cookies["cesium_token"]); 
export const APRS_TOKEN = window.prompt("Enter APRS API Token:", (local_cookies["aprs_token"] == null)? "" : local_cookies["aprs_token"]);
local_cookies["cesium_token"] = CESIUM_TOKEN; 
local_cookies["aprs_token"] = APRS_TOKEN; 

updateCookies(); 
console.log(local_cookies); 
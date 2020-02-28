var day = null;
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded");
  loadMap("./data/meteo.json", "station", day);
  document.querySelector("#dayRange").min = 1;
  document.querySelector("#dayRange").max = 27;
  document.querySelector("#dayRange").onchange = onDayRange;
  document.querySelector("#dayRange").onclick = onDayRange;
  document.querySelector("#revertToStations").onclick = onRevertToStations;
});

function loadMap(path, type = "station", day) {
  if(document.querySelector("#map").childNodes.length > 0) {
    resetMap("#map");
  }
  let map = new Map(type, day);
  map.load(path);
}

function resetMap(selector) {
  let map = document.querySelector(selector);
  let nodeName = map.nodeName;
  let nodeId = map.id;
  let parentMap = map.parentElement;
  let newElement = document.createElement(nodeName);
  newElement.id = nodeId;
  parentMap.removeChild(map);
  parentMap.appendChild(newElement);
}

function resetCharts(selector) {
  let chart = document.querySelector(selector);
  chart.innerHTML = "";
  chart.width = 0;
  chart.height = 0;
}

function onDayRange(event) {
  day = event.target.value;
  loadMap("./data/meteo.json", "meteo", day);
  resetCharts("#station1");
  resetCharts("#station2");
}

function onRevertToStations(event) {
  loadMap("./data/meteo.json", "station", day);
}

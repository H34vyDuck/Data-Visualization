// Define variables for holding our canvas and maps
let myMap
let canvas
const mappa = new Mappa('Leaflet')

// Define points of interest
let romania = {lat:45.916667, lng: 25.1}

var timeline_x = 30;
//var timeline_length = 
var buttons = [];
var newest_selection = 0;

// Set up the options for our map
const options = {
  lat: romania.lat,
  lng: romania.lng,
  zoom: 6.5,
  style: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
}

function preload() {
  geodata = loadJSON('varos.geo.json');
  docdata = loadJSON('output.geojson');
  //geodata = loadJSON('europe.geo.json')
}

let divInfo;

function setup(){
  // Create a canvas on which to draw the map
  canvas = createCanvas(windowWidth, windowHeight)
  console.log(windowWidth + ", " + windowHeight)

  // Create map with the options
  myMap = mappa.tileMap(options)

  // Draw the map on the canvas
  myMap.overlay(canvas)

  polygons = myMap.geoJSON(geodata, 'Point')

  sel = createSelect();
  sel.id('selectRoad');
  sel.parent('#selects');

  ev = geoJsonYears(geodata)
  let unique = [...new Set(ev)]


  for(let i=0; i<unique.length; i++){
    sel.option(unique[i]);
  }
  sel.option('osszes')
  sel.changed(mySelectRoad);

  selectCity = createSelect();
  selectCity.id('citySelect');
  selectCity.parent('#selects')
  if(geodata){
    for (let features of geodata.features){
      const name = features.properties.name;
      selectCity.option(name);
    }
  }
  selectCity.option('osszes')
  selectCity.changed(mySelectCity);
  
  divInfo = createDiv();
  divInfo.id('info');
  divInfo.parent('#infoTab');
  divInfo.hide();

  console.log(geodata);
  console.log(polygons);
  console.log(geoJsonYears(geodata));
  console.log(geoJsonNames(geodata));
  console.log(geoJsonCities(geodata));

  /// A script ellenorzese console-on
  
  db = 1
  for (const [index, features] of docdata.features.entries()){
    isNull = docdata.features[index].properties.year
    if(isNull != null){
      console.log(db + ". " + docdata.features[index].properties.year + " " + docdata.features[index].properties.name);
      db++
    }
  }
  console.log(db);

}

/// A select valasztas utan meghivott fuggveny

function cityMarker(i, color, size, weigth) {
      const pos = myMap.latLngToPixel(polygons[i][1], polygons[i][0])
      stroke(color);
      strokeWeight(weigth);
      ellipse(pos.x, pos.y, size, size)
}

function mySelectCity() {
  let item = selectCity.value();

  names = geoJsonCities(geodata);

  color = "yellow"
  weigth = 5
  size = 5

  for(i in names){
    if(item == names[i]){
      //console.log(polygons[i]);
      cityMarker(i, color, size, weigth)
    }else if(item == "osszes"){
      cityMarker(i, color, size, weigth)
      continue
    }

  }
  
}

function mySelectRoad() {
  let item = sel.value();

  years = geoJsonYears(geodata);
  names = geoJsonCities(geodata);
  road = []

  divInfo.show();
  divInfo.html("###")

  color = "red";
  weigth = 3;
  size = 10;

  for(i in years){
    if(item == years[i]){
      //console.log(polygons[i]);
      road.push(names[i])
      divInfo.html(road.join(" - "))
      cityMarker(i, color, size, weigth)
    }else if(item == "osszes"){
      cityMarker(i, color, size, weigth)
      divInfo.html(names.join(" - "))
      //continue
    }
  }
  
  //console.log(road);
}

function geoJsonYears(data) {
  year = []
  for (let i = 0; i < data.features.length; i++) {
    year.push(data.features[i].properties.year)
  }
  return year
}

function geoJsonNames(data) {
  names = []
  for (let i = 0; i < data.features.length; i++) {
    names.push(data.features[i].properties.person)
  }
  return names
}

function geoJsonCities(data) {
  names = []
  for (let i = 0; i < data.features.length; i++) {
    names.push(data.features[i].properties.name)
  }
  return names
}

function draw(){
  // Clear the canvas on every frame
  clear()
  
  stroke("green")
  strokeWeight(5)
  noFill()
  mySelectCity()
  mySelectRoad()
}
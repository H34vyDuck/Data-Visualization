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

  console.log(geoJsonYears(geodata));

}

function mySelectCity() {
  let item = selectCity.value();
  //console.log(item);
  if(geodata){
    for (const [index, features] of geodata.features.entries()){
      if (features.properties.name == item) {
        //var data = features.geometry.coordinates
        //console.log(index);
        return index
      }
    }
    if("osszes" == item) {
      return -1
    }
  }
  
}

function road(i) {
      const pos = myMap.latLngToPixel(polygons[i][1], polygons[i][0])
      stroke("blue")
      strokeWeight(5)
      ellipse(pos.x, pos.y, 10, 10)
}

function mySelectRoad() {
  let item = sel.value();

  years = geoJsonYears(geodata);
  
  for(i in years){
    if(item == years[i]){
      //console.log(polygons[i]);
      road(i)
    }else if(item == "osszes"){
      road(i)
      continue
    }

  }
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

/*function geoPlotPolygon(data, index) {
  let polygon = data[index][0]
  if (polygon.length > 0) {
    beginShape()
    for (let i = 0; i < polygon.length; i++) {
      pos = myMap.latLngToPixel(polygon[i][1], polygon[i][0])
      //print(pos)
      ellipse(pos.x, pos.y, 10, 10);
    }
    endShape(CLOSE)
  }
}*/

function geoPlotMultiPolygon(data, index) {
  //let polygons = data[index][1]

  coord = data[index]
  if (index >= 0 && index <= data.length) {
  
    divInfo.show();
    divInfo.html(index)

    const pos = myMap.latLngToPixel(coord[1], coord[0])
    //console.log(pos);
    stroke("orange")
    strokeWeight(5)
    ellipse(pos.x, pos.y, 2, 2)
  }else if( index == -1 && geodata){
    for (const [index, features] of geodata.features.entries()){
        //console.log(features.geometry.coordinates[1]);
        const all = myMap.latLngToPixel(features.geometry.coordinates[1], features.geometry.coordinates[0])
        stroke("orange")
        strokeWeight(5)
        //console.log(all);
        ellipse(all.x, all.y, 2, 2)
        divInfo.html("All cities")
    }
  }  
}

/*for (let p=0; p<polygons.length; p++) {
  let polygon = polygons[p]
  pos = myMap.latLngToPixel(polygon[i][1], polygon[i][0])
  if (polygon.length > 0) {
    beginShape()
    for (let i = 0; i < polygon.length; i++) {
      print(pos)
      vertex(pos.x, pos.y)
      
    }
    endShape(CLOSE)
    
  }
}*/

function draw(){
  // Clear the canvas on every frame
  clear()
  
  stroke("green")
  strokeWeight(5)
  noFill()
  if(sel.selected()){
    mySelectRoad()
  }else{
    clear()
  }
  geoPlotMultiPolygon(polygons, mySelectCity())
  /*
  for(features of geodata.features){
    const all = myMap.latLngToPixel(features.geometry.coordinates[1], features.geometry.coordinates[0])
    if(mouseX == all.x){
      console.log(features.properties.name);
    }
  }*/
}
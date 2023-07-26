// Define variables for holding our canvas and maps
let myMap
let canvas
const mappa = new Mappa('Leaflet')
let coords_text

// Define points of interest
let romania = {
  lat:44.416667, 
  lng:26.1
}

let elephant_tree = {lat:51.5168, lng:-0.3093}

// Set up the options for our map
const options = {
  lat: romania.lat,
  lng: romania.lng,
  zoom: 6,
  style: tiles_library.osm.url
}

function preload() {

  geodata = loadJSON('london_boroughs.geo.json');
  geodata = loadJSON('europe.geo.json')
  //print(geodata)

  varos = loadJSON('varos.geo.json')
  ut = loadJSON('ut.geo.json')
  //print(ut)
}

function setup(){
  // Create a canvas on which to draw the map
  canvas = createCanvas(640,640)
  canvas.parent('canvasHolder')

  // Create map with the options
  myMap = mappa.tileMap(options)

  // Draw the map on the canvas
  myMap.overlay(canvas)
  
  //print(london.features[0].geometry.coordinates[0])
  //print(london.features[0].properties.name)
  //polygons = myMap.geoJSON(geodata, 'Polygon')
  //names = geoJsonNames(geodata)
  
  polygons = myMap.geoJSON(geodata, 'MultiPolygon')
  //print(polygons)
  utvonal = myMap.geoJSON(ut, 'Polygon')

  a = myMap.geoJSON(varos, 'Point')
  names = geoJsonNames(varos)

  const sel = createSelect();
  sel.id('roadSelect');
  if(ut){
    for (let features of ut.features){
      const person = features.properties.person;
      const year = features.properties.year;
      const optionText = `${person}, ${year}`;
      sel.option(optionText);
    }
  }

  const selectCity = createSelect();
  selectCity.id('roadSelect');
  if(ut){
    for (let features of varos.features){
      const name = features.properties.name;
      selectCity.option(name);
    }
  }
  
  sel.parent('selectHolder')
  selectCity.parent('selectHolder')
//  print(names)
//  print(polygons)

}

function geoJsonNames(data) {
  names = []
  for (let i = 0; i < data.features.length; i++) {
    names.push(data.features[i].properties.name)
  }
  //console.log(names)
  return names
}

function geoPlotPolygon(data, index) {
  let polygon = data[index][0]
    beginShape()

    for (let i = 0; i < polygon.length; i++) {
      pos = myMap.latLngToPixel(polygon[i], polygon[i])
      //print(pos)
      vertex(pos.x, pos.y)
    }
    endShape()
}

/// Az en fuggvenyeim  ///

function mySelectEvent1() {
  let item = sel.value();
  if(item == "ut1"){
    return 0;
  }else if(item == "ut2"){
    return 1;
  }else if(item == "osszes"){
    return 2;
  }
}

/*

function mySelectEvent2(){
  let item = selectMenu.value();
  if(item == "sepsiszentgyorgy" || item == "csikszereda" || item == "udvarhely" || item == "parajd"){
    return 1;
  }else if(item == "kolozsvar" || item == "vasarhely" || item == "parajd"){
    return 2;
  }
}

*/

function geoPoint(data, index, ut){

  let point = a[index]
  let road = data.features[index].properties.road
  let both = data.features[index].properties.both

  beginShape(LINES)

  stroke("black")
  strokeWeight(10)
  noFill()

  for(let i=0; i<a.length; i++){
    pos = myMap.latLngToPixel(point[0], point[1])
    if(ut == road){
      vertex(pos.x, pos.y)
    }else if(ut == both){
      vertex(pos.x, pos.y)
    }
    endShape(CLOSE)
  }
}

/// *** ///

function geoPlotMultiPolygon(data, index) {
  let polygons = data[index][0]
  for (let p=0; p<polygons.length; p++) {
    let polygon = polygons[p]
    if (polygon.length > 0) {
      beginShape()
      for (let i = 0; i < polygon.length; i++) {
        pos = myMap.latLngToPixel(polygon[i][1], polygon[i][0])
        vertex(pos.x, pos.y)
      }
      endShape(CLOSE)
    }
  }
}

function draw(){
   // Clear the canvas on every frame
  clear()

  //route = geodata.features[1].geometry.coordinates[0][0]

  //route = polygons//geodata.features[0].geometry.coordinates[0]
  //print(route)
  //print(route)
  
  //point = varos.features[1].geometry.coordinates
  //console.log(point);
  
  //console.log(a.length);
  
  stroke("red")
  strokeWeight(3)
  noFill()


  geoPlotPolygon(utvonal, 0)
  stroke("green")
  geoPlotPolygon(utvonal, 1)
  stroke("blue")
  geoPlotPolygon(utvonal, 2)

  for(let i=0; i<a.length; i++){
    geoPoint(varos, i, 3)
  }
  
  
  //geoPlotMultiPolygon(polygons, 1)

}


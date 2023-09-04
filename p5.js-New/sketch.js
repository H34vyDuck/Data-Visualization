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
let dataJson = {
  "type": "FeatureCollection",
  "features": []
};
let locationJson = {
  "locations": []
}

function preload() {
  geodata = loadJSON('data1.geo.json');
  docdata = loadStrings('routes.txt');
  //geodata = loadJSON('europe.geo.json')

  
}

let divInfo;

function setup(){

  // TODO 
  // let label; 
  // let year = 0;
  // let person = '';  
  // for (i = 0 ;i < docdata.length -1; i++){
  //   if (docdata[i].length < 100){

  //       const entries = split(docdata[i], '(');
  //       label = docdata[i]
  //       person = trim(entries[0]);
  //       year = entries[1].slice(0,-1);
  //       let locations = split(docdata[i+1], ' — ');

  //       for (j = 0 ;j < locations.length; j++){

  //         locations[j] = locations[j].replace(',','');
  //         locations[j] = locations[j].replace('(','');
  //         locations[j] = locations[j].replace(')','');
  //         const entries2 = split(locations[j], ' ');

  //         dataJson.features.push({

  //           "type": "Feature",
  //           "properties": {
  //               "label": label,
  //               "name": entries2[0],
  //               "person": person,
  //               "year": year,
  //           },
            
            
  //         })
  //         locationJson.locations.push({
  //           name: entries2[0]
  //         })
  //       }

  //   }
  // }

  // let dataJsonAll = dataJson;
  // for(let i = 0; i< locationJson.locations.length ; i++)
  // {
  //   if(locationJson.locations[i].name){
  //     let url = "https://api.openweathermap.org/geo/1.0/direct?q=" + locationJson.locations[i].name + "&limit=1&appid=a6e48116d64135042e74451a0e4d0ada";
    
  //     httpGet(url, 'json', false, function(response) {
  //       if(response && response[0] && response[0].lon && response[0].lat) {

  //         for (let j=0; j < dataJson.features.length; j++){

  //           if( locationJson.locations[i].name == dataJson.features[j].properties.name ){
  //               dataJsonAll.features[j].geometry = {
  //                 "coordinates": [
  //                   response[0].lon,
  //                   response[0].lat
  //                 ],
  //                 "type": "Point"
  //               }
  //           }

  //           let dataJsonAllSend = {
  //             features: [],
  //             type: "FeatureCollection"
  //           }

  //           if ( i == locationJson.locations.length - 1 && j == dataJson.features.length - 1){

  //             for (let k = 0; k < dataJsonAll.features.length; k++)
  //             {
  //               if(typeof dataJsonAll.features[k].geometry != "undefined"){
  //                 dataJsonAllSend.features.push(dataJsonAll.features[k]);
  //               }
  //             }
  //             console.log(dataJsonAllSend)
  //             saveJSON(dataJsonAllSend, 'data.geo.json');
  //           }
            
  //         }
  //       }
  //     })

  //   }
    

  // }


  // Create a canvas on which to draw the map
  canvas = createCanvas(windowWidth, windowHeight)

  // Create map with the options
  myMap = mappa.tileMap(options)

  // Draw the map on the canvas
  myMap.overlay(canvas)

  polygons = myMap.geoJSON(geodata, 'Point')

  selectRoute = createSelect();
  selectRoute.id('selectRoad');
  selectRoute.parent('#selects');

  let labels = geoJsonLabels(geodata)
  labels = [...new Set(labels)]

  for(let i=0; i<labels.length; i++){
    selectRoute.option(labels[i]);
  }
  selectRoute.changed(mySelectRoad);

  // selectCity = createSelect();
  // selectCity.id('citySelect');
  // selectCity.parent('#selects')
  // if(geodata){
  //   for (let features of geodata.features){
  //     const name = features.properties.name;
  //     selectCity.option(name);
  //   }
  // }
  // selectCity.option('all')
  // selectCity.changed(mySelectCity);
  
  divInfo = createDiv();
  divInfo.id('info');
  divInfo.parent('#infoTab');
  divInfo.hide();

  
}

/// A select valasztas utan meghivott fuggveny

function cityMarker(i, color, size, weigth) {
  if(polygons &&  polygons[i])
  {

    const pos = myMap.latLngToPixel(polygons[i][1], polygons[i][0])
    stroke(color);
    strokeWeight(weigth);
    ellipse(pos.x, pos.y, size, size)
  }
}

// function mySelectCity() {
//   let item = selectCity.value();

//   names = geoJsonCities(geodata);

//   color = "yellow"
//   weigth = 5
//   size = 5

//   for(i in names){
//     if(item == names[i]){
//       //console.log(polygons[i]);
//       cityMarker(i, color, size, weigth)
//     }else if(item == "osszes"){
//       cityMarker(i, color, size, weigth)
//       continue
//     }

//   }
  
// }

function mySelectRoad() {
  let item = selectRoute.value();

  labels = geoJsonLabels(geodata);
  names = geoJsonCities(geodata);
  road = []

  divInfo.show();
  divInfo.html("###")

  color = "red";
  weigth = 3;
  size = 10;
  for(let i=0; i<labels.length; i++){
    if(item == labels[i]){
      road.push(names[i])
      divInfo.html(road.join(" - "))
      cityMarker(i, color, size, weigth)
    }
  }
  
  //console.log(road);
}

function geoJsonLabels(data) {
  labels = []
  for (let i = 0; i < data.features.length; i++) {
    labels.push(data.features[i].properties.label)
  }
  return labels
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
  // mySelectCity()
  mySelectRoad()
}
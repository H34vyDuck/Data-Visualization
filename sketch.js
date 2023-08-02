
function preload() {
  varos = loadJSON('varos.geo.json');
}

let sel;
let selectCity;
var geojsonMarkerOptions = {
  radius: 4,
  fillColor: "#ff7800",
  color: "#ff7800",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

function mySelectEvent() {
  let item = selectCity.value();
  console.log(item);
  if(item == city){
    console.log(features.properties.year);
  }
  var layer = new L.geoJson(varos, {
    pointToLayer: function (feature, latLng) {
      return L.circleMarker(item).bindPopup(item).on('mouseover', function() {
        this.bindPopup(feature.properties.name).openPopup();
    })}
});
}

function mySelectRoad() {
  let item = sel.value();
  return item;
}
/**
   L.geoJSON(varos, {
     filter: function(feature, layer) {
       return feature.properties.road == 1;
    },
    pointToLayer: function (feature, latlng) {
        city = feature.properties.name
        return L.circleMarker(latlng, geojsonMarkerOptions).bindPopup(city).on('mouseover', function() {
          this.bindPopup(feature.properties.name).openPopup();
        });
    }
  }).addTo(map);
*/

function geoJsonNames(data) {
  names = []
  for (let i = 0; i < data.features.length; i++) {
    names.push(data.features[i].properties.year)
  }
  //console.log(names)
  return names
}

function setup() { 
  //createCanvas(1200,100)

  ///

  var map = L.map('mapid',{scrollWheelZoom:true, zoomControl: false, fadeAnimation: true}).setView([45.916667, 25.1], 6.5);

  L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>  contributors &copy;  <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    minZoom: 6.5,
  }).addTo(map);


  sel = createSelect();
  sel.id('selectRoad');
  sel.parent('#sketch');

  ev = geoJsonNames(varos)
  let unique = [...new Set(ev)]


  for(let i=0; i<unique.length; i++){
    sel.option(unique[i]);
  }
  sel.changed(mySelectRoad);

  /*if(varos){
    for (let features of varos.features){

      const pers = features.properties.szemely;
      const year = features.properties.year;

      const optionText = `${pers}, ${year}`;
      
    }
  }*/

  selectCity = createSelect();
  selectCity.id('selectCity');
  selectCity.parent('#sketch')
  if(varos){
    for (let features of varos.features){
      const name = features.properties.name;
      selectCity.option(name);
    }
  }
  selectCity.option('osszes')
  selectCity.changed(mySelectEvent);

  L.geoJSON(varos, {
    filter: function(feature, layer) {
      return feature.properties.year == mySelectRoad();
   },
   pointToLayer: function (feature, latlng) {
       city = feature.properties.name
       return L.circleMarker(latlng, geojsonMarkerOptions).bindPopup(city).on('mouseover', function() {
         this.bindPopup(feature.properties.name).openPopup();
     });
   }
 }).addTo(map);

}

function draw() {
  //mySelectRoad();
}
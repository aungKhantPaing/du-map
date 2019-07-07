alert("app version: 0.0.0");

// MAP SETUP ---------------- BGN ----------------
var map;

// Adding layers --v
var mapboxAccessToken = 'pk.eyJ1IjoiYWtwMTAxIiwiYSI6ImNqeGtrbnVwazAxM2Izbm1vOWYwdHQxdjkifQ.gtLMDe9KAEU2rxBvk_vnzw';
var grayscale_layer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light'}),
    streets_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});

map = L.map('mapid', {
    center: [16.911199, 96.212739],
    zoom: 15.5,
    layers: grayscale_layer
});

// Adding control layers --v
var basic_layers = {
    "Grayscale": grayscale_layer,
    "Streets": streets_layer
};

L.control.layers(basic_layers).addTo(map);
// MAP SETUP ---------------- END ----------------





// ADD DEPARTMENT AREAS ---------------- BGN ----------------
var geoJson;
// area style --v
function areaStyle(feature) {
    return {
        fillColor: '#3cba54',
        weight: '1',
        opacity: 2,
        color: 'black',
        dashArray: '5',
        fillOpacity: 0.4
    }
}

//areas' event --v
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        dashArray: '',
        fillOpacity: 0.7
    })

    layer.bringToFront();
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function setEvents(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// areas added to map --v
geojson = L.geoJson(department_area, {
    style: areaStyle,
    onEachFeature: setEvents
}).addTo(map);
// ADD DEPARTMENT AREAS ---------------- END ----------------





// USER LOCATION ---------------- BGN ----------------
// get user's location --v
var user_lat, user_lng;
var userLocation = L.marker();
navigator.geolocation.watchPosition(success, error, options);

var options = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 27000
};
function success(pos) {
    var crd = pos.coords;
  
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    userLocation.setLatLng([crd.latitude, crd.longitude]).addTo(map);

    user_lat = crd.latitude;
    user_lng = crd.longitude;
}
function success_zoomToUserLocation(pos){
    success(pos);
    map.setView([user_lat, user_lng], 100);
}
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    alert('GPS is needed to show user location');
}
// USER LOCATION ---------------- END ----------------





// BUTTON EVENTS ---------------- BGN ----------------
// to DU --v
function zoomToDU(){
    map.setView([16.911199, 96.212739], 15.5);
}

// to user's location --v

function showUserLocation(){
    navigator.geolocation.getCurrentPosition(success_zoomToUserLocation, error, options);
}
// BUTTON EVENTS ---------------- END ----------------
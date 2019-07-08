alert("app version: 0.0.0");
var map;

// SETUP LAYERS ---------------- BGN ----------------
var mapboxAccessToken = 'pk.eyJ1IjoiYWtwMTAxIiwiYSI6ImNqeGtrbnVwazAxM2Izbm1vOWYwdHQxdjkifQ.gtLMDe9KAEU2rxBvk_vnzw';
var grayscale_layer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light'});
var streets_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
// SETUP LAYERS ---------------- END ----------------





// SETUP DEPARTMENT AREAS ---------------- BGN ----------------
var department_areas;
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
    department_areas.resetStyle(e.target);
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
department_areas = L.geoJson(department_areas_geoJson, {
    style: areaStyle,
    onEachFeature: setEvents
});
// SETUP DEPARTMENT AREAS ---------------- END ----------------





// SETUP DEPARTMENTS ---------------- BGN ----------------
var departmentsMarkerStyle = {
    radius: 6,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

var departments = L.geoJson(departments_geoJson, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, departmentsMarkerStyle);
    }
}).bindPopup(function (layer) {
        return layer.feature.properties.name;
});
// SETUP DEPARTMENTS ---------------- END ----------------





// SETUP CONTROL LAYERS ---------------- BGN ----------------
// Adding control layers --v
var basic_layers = {
    "Grayscale": grayscale_layer,
    "Streets": streets_layer
};

var places = {
    "Departments": departments,
    "Areas": department_areas
};

function add_controlLayers(target){
    L.control.layers(basic_layers, places).addTo(target);
}
// SETUP CONTROL LAYERS ---------------- END ----------------





// ADD TO MAP ---------------- BGN ----------------
map = L.map('mapid', {
    center: [16.911199, 96.212739],
    zoom: 15.5,
    layers: [grayscale_layer, departments]
});
add_controlLayers(map);
// ADD TO MAP ---------------- END ----------------





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
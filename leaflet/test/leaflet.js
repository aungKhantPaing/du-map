alert("app version: 0.0.2");
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
var departmentsIcon = L.icon({
    iconUrl: 'img/bank.svg',
    iconSize:     [34, 34], // size of the icon
    // shadowSize:   [34, 34], // size of the shadow
    iconAnchor:   [17, 32], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, -25] // point from which the popup should open relative to the iconAnchor
});

var departments = L.geoJson(departments_geoJson, {
    pointToLayer: function (feature, latlng){
        return L.marker(latlng, {icon: departmentsIcon});
    }
}).bindPopup(function (layer) {
        var name = layer.feature.properties.name;
        return `<b>${name}</b>`;
});
// SETUP DEPARTMENTS ---------------- END ----------------




// SETUP BUSSTOPS ---------------- BGN ----------------
var busStopIcon = L.icon({
    iconUrl: 'img/busstop.svg',
    iconSize:     [34, 34], // size of the icon
    // shadowSize:   [34, 34], // size of the shadow
    iconAnchor:   [17, 32], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, -25] // point from which the popup should open relative to the iconAnchor
});

var busStops = L.geoJson(busStops_geoJson, {
    pointToLayer: function (feature, latlng){
        return L.marker(latlng, {icon: busStopIcon});
    }
}).bindPopup(function (layer) {
        var name = layer.feature.properties.name;
        return `<b>${name}</b>`;
});
// SETUP BUSSTOPS ---------------- END ----------------






// SETUP OTHER PLACES ---------------- BGN ----------------
var clanicIcon = L.icon({
    iconUrl: 'img/clanic.svg',

    iconSize:     [34, 34], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [17, 32], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-7.55, -30] // point from which the popup should open relative to the iconAnchor
}),
    libraryIcon = L.icon({
        iconUrl: 'img/library.svg',
    
        iconSize:     [34, 34], // size of the icon
        // shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [17, 32], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-7.55, -30] // point from which the popup should open relative to the iconAnchor
    }),
    mailboxIcon = L.icon({
        iconUrl: 'img/mailbox.svg',
    
        iconSize:     [34, 34], // size of the icon
        // shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [17, 32], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-7.55, -30] // point from which the popup should open relative to the iconAnchor
    });

var otherPlaces = L.geoJson(otherPlaces_geoJson, {
    pointToLayer: function (feature, latlng){
        switch (feature.properties.id) {
            case 'clanic': return L.marker(latlng, {icon: clanicIcon});
            case 'library': return L.marker(latlng, {icon: libraryIcon});
            case 'mailbox': return L.marker(latlng, {icon: mailboxIcon});
        }
    }
}).bindPopup(function (layer) {
    var name = layer.feature.properties.name;
    return `<b>${name}</b>`;
});
// SETUP OTHER PLACES ---------------- END ----------------





// SETUP CONTROL LAYERS ---------------- BGN ----------------
// Adding control layers --v
var basic_layers = {
    "Grayscale": grayscale_layer,
    "Streets": streets_layer
};

var places = {
    "Departments": departments,
    "Areas": department_areas,
    "Bus Stops": busStops,
    "Other Places": otherPlaces
};

function add_controlLayers(target){
    L.control.layers(basic_layers, places).addTo(target);
}
// SETUP CONTROL LAYERS ---------------- END ----------------





// ADD TO MAP ---------------- BGN ----------------
map = L.map('mapid', {
    center: [16.911199, 96.212739],
    zoom: 15.5,
    layers: [grayscale_layer, departments, otherPlaces]
});
add_controlLayers(map);
// ADD TO MAP ---------------- END ----------------

// TEST for iconAnchor
// L.geoJson(departments_geoJson, {
//     pointToLayer: function (feature, latlng){
//         return L.circleMarker(latlng, {radius: 1});
//     }
// }).addTo(map);




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
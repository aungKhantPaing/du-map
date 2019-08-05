var map;

// SETUP LAYERS
var grayscale_layer = L.tileLayer(constants.mapLayers.mapBox.link, {
    id: constants.mapLayers.mapBox.id
});
var streets_layer = L.tileLayer(constants.mapLayers.openStreet.link, {
    attribution: constants.mapLayers.openStreet.sign
});

// SETUP Highlighter
var highlightIcon = getIcon('res/img/gps.svg', 36, [17.5, 37], [1,-25]);
var pointerHighlighter = L.marker(L.latLng(0,0));
function highlightPointer(e){
    pointerHighlighter.removeFrom(map);
    pointerHighlighter = L.marker(e.latlng, {icon:highlightIcon}).addTo(map);
}
function setPointersEvent(feature, layer) {
    layer.on({
        click: highlightPointer
    })
}

// HELPERs
function setupPlace(iconUrl, place_geoJson) {
    var placeIcon = getIcon(iconUrl);

    return place = L.geoJson(place_geoJson, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: placeIcon
            });
        },
        onEachFeature: setPointersEvent
    }).bindPopup(function (layer) {
        var name = layer.feature.properties.name;
        return `<b>${name}</b>`;
    });
}
function getIcon(iconUrl, iconSize=34, iconAnchor=[17, 32], popupAnchor=[1, -25], shadowSize, shadowAnchor) {
    return L.icon({
        iconUrl: iconUrl,
        iconSize: [iconSize, iconSize], // size of the icon
        shadowSize: shadowSize, // size of the shadow
        iconAnchor: iconAnchor, // point of the icon which will correspond to marker's location
        shadowAnchor: shadowAnchor,  // the same for the shadow
        popupAnchor: popupAnchor
    })
}

// SETUP PLACEs
var departments = setupPlace('res/img/department.svg', departments_geoJson);
var busStops = setupPlace('res/img/busstop.svg', busStops_geoJson);

// SETUP OTHER PLACEs
var clanicIcon = getIcon('res/img/clanic.svg'),
    libraryIcon = getIcon('res/img/library.svg'),
    mailboxIcon = getIcon('res/img/mailbox.svg');

var otherPlaces = L.geoJson(otherPlaces_geoJson, {
    pointToLayer: function ({ properties:{id} }, latlng) {
        switch (id) {
            case constants.id.otherPlaces.clanic:
                return L.marker(latlng, {
                    icon: clanicIcon
                });
            case constants.id.otherPlaces.library:
                return L.marker(latlng, {
                    icon: libraryIcon
                });
            case constants.id.otherPlaces.mailbox:
                return L.marker(latlng, {
                    icon: mailboxIcon
                });
        }
    },
    onEachFeature: setPointersEvent
}).bindPopup(function (layer) {
    var name = layer.feature.properties.name;
    return `<b>${name}</b>`;
});

// SETUP ControlLayers
var basic_layers = {
    "Grayscale": grayscale_layer,
    "Streets": streets_layer
};
var places = {
    "Departments": departments,
    "Bus Stops": busStops,
    "Other Places": otherPlaces
};
function addControlLayers(target) {
    L.control.layers(basic_layers, places).addTo(target);
}

// AddTo MAP
map = L.map("mapid", {
    center: [16.911199, 96.212739],
    zoom: 15.5,
    layers: [grayscale_layer, departments, otherPlaces],
    zoomControl: false
});
addControlLayers(map);
pointerHighlighter.addTo(map);


// Get user's location
var user_lat, user_lng;
var userLocation = L.circleMarker();
navigator.geolocation.watchPosition(success, error, options);

var options = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 27000
};
function success(pos) {
    var crd = pos.coords;
    
    console.log(`current position: ${crd.latitude}, ${crd.longitude}(accu:${crd.accuracy}m)`)
    
    userLocation.setLatLng([crd.latitude, crd.longitude]).addTo(map);
    
    user_lat = crd.latitude;
    user_lng = crd.longitude;
}
function success_zoomToUserLocation(pos) {
    success(pos);
    map.setView([user_lat, user_lng], 100);
}
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    alert('GPS is needed to show user location');
}

// Button EVENTS
function zoomToDU() {
    map.setView([16.911199, 96.212739], 15.5);
}
function showUserLocation() {
    navigator.geolocation.getCurrentPosition(success_zoomToUserLocation, error, options);
}

// TEST for iconAnchor
L.geoJson(departments_geoJson, {
    pointToLayer: function (feature, latlng){
        return L.circleMarker(latlng, {radius: 1});
    }
});//.addTo(map);
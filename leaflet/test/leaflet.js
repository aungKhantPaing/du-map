var geoJson;
var mapboxAccessToken = 'pk.eyJ1IjoiYWtwMTAxIiwiYSI6ImNqeGtrbnVwazAxM2Izbm1vOWYwdHQxdjkifQ.gtLMDe9KAEU2rxBvk_vnzw';
var map = L.map('mapid').setView([16.911199, 96.212739], 15.5);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light'
}).addTo(map);

// L.marker([16.911199, 96.212739]).addTo(mymap)
//     .bindPopup('DU')
//     .openPopup();

// var popup = L.popup()
//     .setLatLng([16.911199, 96.212739])
//     .setContent("Dagon University")
//     .openOn(mymap);

// mymap.on('click', onMapClick);

// Event
function onMapClick(e) {
    alert(e.latlng);
}

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

// Interactions
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

var du_corner1 = L.latLng(16.91902, 96.223776), 
du_corner2 = L.latLng(16.909276, 96.20009);
du_bounds = L.latLngBounds(du_corner1, du_corner2);
function zoomToDU(){
    map.fitBounds(du_bounds);
}

geojson = L.geoJson(department_area, {
    style: areaStyle,
    onEachFeature: setEvents
}).addTo(map);
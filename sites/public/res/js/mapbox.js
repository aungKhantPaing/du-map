mapboxgl.accessToken =
    "pk.eyJ1IjoiYWtwMTAxIiwiYSI6ImNqeGtrbnVwazAxM2Izbm1vOWYwdHQxdjkifQ.gtLMDe9KAEU2rxBvk_vnzw";
var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/akp101/cjxkkxwpc01x11cnur0aepitf/draft",
    center: [96.212739, 16.911199],
    zoom: 14.8
    // bearing: -27.5 // rotation
});
map.touchZoomRotate.enable();
map.touchZoomRotate.enableRotation();

// Add zoom, rotation and location controls to the map.
var zoomControl = new mapboxgl.NavigationControl({
    visualizePitch: true
});
var locationControl = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    fitBoundsOptions: {
        // offset: [0,-5.7], // for desktop
        offset: [0, -3.5], // for mobiles
        zoom: 15
    }
});
var geoCoderControl = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: marker,
})

map.addControl(zoomControl).addControl(locationControl).addControl(geoCoderControl, 'top-left');

var marker = new mapboxgl.Marker().setLngLat([0, 0]).addTo(map);

// Bioler Plates
function highlightPlace(id, coordinates) {
    marker.remove()
    
    marker.setLngLat(coordinates).addTo(map)

    map.flyTo({
        center: coordinates,
        zoom: 18
    })

    // NOTE: layer.source = 'composite'

    map.setFilter('building-3d-highlighted', ['in', 'id', id]) // highlight the 3d structure with same id
}

// Events
function locate() {
    locationControl.trigger();
}

map.on("mouseenter", 'poi-label-places', function () {
    // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
    map.getCanvas().style.cursor = "pointer";
});

map.on("mouseleave", 'poi-label-places', function () {
    // Change it back to a pointer when it leaves.
    map.getCanvas().style.cursor = "";
});

function playCamera() {
    rotateCamera(0)
}

function rotateCamera(timestamp) {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    map.rotateTo((timestamp / 100) % 360, {
        duration: 0
    });
    // Request the next frame of the animation.
    requestAnimationFrame(rotateCamera);
}
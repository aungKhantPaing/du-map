mapboxgl.accessToken = 'pk.eyJ1IjoiYWtwMTAxIiwiYSI6ImNqeGtrbnVwazAxM2Izbm1vOWYwdHQxdjkifQ.gtLMDe9KAEU2rxBvk_vnzw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/akp101/cjxkkxwpc01x11cnur0aepitf/draft',
    center: [96.212739, 16.911199],
    zoom: 14.8,
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

map.addControl(zoomControl).addControl(locationControl);

function locate() {
    locationControl.trigger()
}

// Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
map.on('click', 'poi-label', function (e) {
    map.flyTo({
        center: e.features[0].geometry.coordinates
    });
});

// Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
map.on('mouseenter', 'poi-label', function () {
    map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'poi-label', function () {
    map.getCanvas().style.cursor = '';
});
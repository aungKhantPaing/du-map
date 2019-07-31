mapboxgl.accessToken = 'pk.eyJ1IjoiYWtwMTAxIiwiYSI6ImNqeGtrbnVwazAxM2Izbm1vOWYwdHQxdjkifQ.gtLMDe9KAEU2rxBvk_vnzw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [96.212739, 16.911199],
    zoom: 14.8,
    // bearing: -27.5 // rotation
});

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
        offset: [0,-3.5], // for mobiles
        zoom: 15
    }
});

map.addControl(zoomControl).addControl(locationControl, 'bottom-right');

function locate() {
    locationControl.trigger()
    map.zoomTo(10)
}
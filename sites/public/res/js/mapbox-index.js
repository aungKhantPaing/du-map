mapboxgl.accessToken =
    "pk.eyJ1IjoiYWtwMTAxIiwiYSI6ImNqeGtrbnVwazAxM2Izbm1vOWYwdHQxdjkifQ.gtLMDe9KAEU2rxBvk_vnzw";
var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/akp101/cjxkkxwpc01x11cnur0aepitf/draft",
    center: [96.210298,16.915679],
    zoom: 17,
    pitch: 60,
    // bearing: -27.5 // rotation
})


map.touchZoomRotate.enable()
map.touchZoomRotate.enableRotation()

map.on('load', function() {
    rotateCamera(0)
})


console.log(map)
pitch: 45
function rotateCamera(timestamp) {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    map.rotateTo((timestamp / 100) % 360, {
        duration: 6
    });
    // Request the next frame of the animation.
    requestAnimationFrame(rotateCamera);
}
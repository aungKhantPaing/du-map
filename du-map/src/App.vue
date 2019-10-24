<template>
  <div id="app">
    <div class="progress-container" v-if="dataLoaded == false">
      <div class="progress">
        <div class="indeterminate"></div>
      </div>
    </div>

    <div id="map"></div>
    // TODO: add side bar
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
export default {
  data() {
    return {
      dataLoaded: false
    };
  },
  mounted() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYWtwMTAxIiwiYSI6ImNqeGtrbnVwazAxM2Izbm1vOWYwdHQxdjkifQ.gtLMDe9KAEU2rxBvk_vnzw";
    var map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/akp101/cjxkkxwpc01x11cnur0aepitf/draft",
      center: [96.212739, 16.911199],
      zoom: 14.8,
      maxBounds: [
        [96.20043008891338, 16.899012663005408], // Southwest coordinates
        [96.22252355799174, 16.9239222243597] // Northeast coordinates
      ],
      bearing: -27.5 // rotation
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

    map.on("load", () => {
      this.dataLoaded = true;
    });
  }
};
</script>

<style lang="scss" scoped>
// put ~ infront to import node_module
//? can't find a way to import scss yet
@import url("~materialize-css/dist/css/materialize.css");

#map {
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}

.progress-container {
  height: 100vh;
  .progress {
    position: fixed;
    top: 50vh;
    .indeterminate {
      width: 70%;
    }
  }
}
</style>

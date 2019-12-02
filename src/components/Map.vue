<template>
  <div id="map"></div>
</template>

<script lang="ts">
/* eslint-disable no-console */
import { Vue, Component, Prop } from "vue-property-decorator";
import mapboxgl from "mapbox-gl";
import { mapMutations } from "vuex";
import { Place } from "@/models/place";
import eventBus from "@/eventBus";
import store from "@/store";
import { MapboxOptions } from "mapbox-gl/index";

@Component({
  methods: mapMutations(["setPlaceList", "setDataLoaded"])
})
export default class Map extends Vue {
  @Prop()
  readonly mapOptions!: Object;

  @Prop()
  readonly token!: string;

  @Prop({
    type: Boolean,
    default: () => true
  })
  readonly zoomControl!: Boolean;

  @Prop({
    type: Boolean,
    default: () => false
  })
  readonly locationControl!: Boolean;

  options: MapboxOptions = {
    container: "map",
    ...this.mapOptions
  };

  config(map: mapboxgl.Map) {
    // Add zoom, rotation and location controls to the map.
    const zoomControl = new mapboxgl.NavigationControl({
      visualizePitch: true
    });
    const locationControl = new mapboxgl.GeolocateControl({
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

    if (this.zoomControl) {
      map.addControl(zoomControl);
    }
    if (this.locationControl) {
      map.addControl(locationControl);
    }
    // map.touchZoomRotate.enableRotation();

    // 🖱️ set cursor events
    // change the cursor to pointer 👆 when the it enters a feature in the 'symbols' layer.
    map.on("mouseenter", "poi-label-places", function() {
      map.getCanvas().style.cursor = "pointer";
    });
    // change it back to a cursor when it leaves.
    map.on("mouseleave", "poi-label-places", function() {
      map.getCanvas().style.cursor = "";
    });
  }
  // dirty data -> filter -> sort -> clean data
  getCleanedPlaceData(map: mapboxgl.Map): Array<Place> {
    // query dirty list data from map
    let sourceFeatures = map.querySourceFeatures("composite", {
      sourceLayer: "DU_Places_New" // require if sourceLayer is a vector_tileset
    });

    // filter duplicated data
    sourceFeatures.forEach(targetPlace => {
      var duplicatedItems: any[] = [];
      sourceFeatures.forEach(place => {
        if (
          JSON.stringify(targetPlace.properties) ===
            JSON.stringify(place.properties) && // compare primitive data
          targetPlace != place // compare reference data
        ) {
          duplicatedItems.push(place); // get the duplicates
        }
      });
      // remove the duplicatedItem(s) of targetPlace
      duplicatedItems.forEach(item => {
        var itemIndex = sourceFeatures.indexOf(item);
        sourceFeatures.splice(itemIndex, 1);
      });
    });

    // sort alphabetically
    sourceFeatures.sort(compare);
    function compare(a: any, b: any) {
      var aString = "" + a.properties.name_en; // cast to unicode
      var bString = "" + b.properties.name_en;
      if (aString < bString) {
        return -1;
      }
      if (aString > bString) {
        return 1;
      }
      return 0;
    }

    console.log(sourceFeatures);

    return sourceFeatures.map(feature => Place.parse(feature));
  }

  mounted() {
    // ⚙️ CONFIG MAP
    mapboxgl.accessToken = this.token;
    let map = new mapboxgl.Map(this.$data.options);
    this.config(map);
    let marker = new mapboxgl.Marker({
      color: "#F85A40" // red
    })
      .setLngLat([0, 0])
      .addTo(map);

    // 👂 LISTEN EVENTs
    // call after map data are fully loaded
    map.on("load", () => {
      this.$emit("loaded", this.getCleanedPlaceData(map));
      eventBus.$emit("loaded");
    });

    // listen to mouse events as soon as the components are mounted.
    // remove highlight when user click/tap other area of the map (non-icon area)
    map.on("click", _ => {
      removeHighlight();
      this.$router.replace("/");
    });
    // highlight when user specifically click/tap place icon
    //* event --> router.push --> highlight
    map.on("click", "poi-label-places", e => {
      if (e.features) {
        let place = Place.parse(e.features[0]);
        this.$router.push(`/place/${place.properties.id}`);
      }
    });

    eventBus.$on("removeHighlight", () => {
      removeHighlight();
      this.$router.replace("/");
    });
    eventBus.$on("highlightPlace", (place: Place) => {
      highlightPlace(place);
    });

    let removeHighlight = () => {
      marker.remove();
      map.setFilter("building-3d-highlighted", ["in", "id", ""]); // remove highlight
    };
    let highlightPlace = (place: Place) => {
      marker.remove(); // remove default-marker from mapbox.js
      try {
        marker.setLngLat(place.geometry.coordinates).addTo(map); // pin the marker
      } catch (error) {
        console.log(place);
      }
      map.flyTo({
        center: place.geometry.coordinates,
        zoom: 18
      });

      // highlight the 3d structure by filtering with equal id
      map.setFilter("building-3d-highlighted", [
        "in",
        "id",
        place.properties.id
      ]);
    };
  }
}
</script>

<style scoped>
#map {
  /* overflow: hidden;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 100%;
  width: 100%;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px; */
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>

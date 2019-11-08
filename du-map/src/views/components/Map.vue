<template>
  <div id="map"></div>
</template>

<script lang="ts">
/* eslint-disable no-console */
import { mapState } from "vuex";
import mapboxgl from "mapbox-gl";
import * as PList from "@/models/placeList";
import Place from "@/models/place";

export default {
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

    // dirty data -> filter -> sort -> categorize -> clean data
    function getCleanedPlaceData(): Array<PList.PlaceList> {
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
              JSON.stringify(place.properties) &&
            targetPlace != place
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

      // categorize places
      let departments = new PList.DepartmentList();
      let busStops = new PList.BusStopList();
      let canteens = new PList.CanteenList();
      let copiers = new PList.CopierList();
      let activities = new PList.ActivityList();
      let hostels = new PList.HostelList();
      let otherPlaces = new PList.OtherPlaceList();

      var placeGroups: PList.DepartmentList[] = [
        departments,
        busStops,
        canteens,
        copiers,
        activities,
        hostels,
        otherPlaces
      ];
      var place;

      sourceFeatures.forEach(feature => {
        place = new Place(feature.properties, feature.geometry);

        switch (place.properties.type) {
          case "department":
            departments.placeList.push(place);
            break;
          case "bus stop":
            busStops.placeList.push(place);
            break;
          case "canteen":
            canteens.placeList.push(place);
            break;
          case "stadium":
            activities.placeList.push(place);
            break;
          case "library":
            activities.placeList.push(place);
            break;
          case "rc":
            activities.placeList.push(place);
            break;
          case "copier":
            copiers.placeList.push(place);
            break;
          case "hostel":
            hostels.placeList.push(place);
            break;
          default:
            otherPlaces.placeList.push(place);
        }
      });

      console.log(placeGroups);

      return placeGroups;
    }

    map.on("load", () => {
      this.$store.commit("setPlaceLists", getCleanedPlaceData());
      this.$store.commit("setDataLoaded", true);
    });
  },
  computed: mapState(["dataLoaded", "placeLists"])
};
</script>

<style scoped>
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
</style>

<template>
  <v-app>
    <Map @loaded="onLoaded" :map-options="mapOptions" :token="token" location-control />

    <progress-indicator :show="!dataLoaded" />
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import store from '@/store';
import { mapState } from 'vuex';
import Map from '@/components/Map.vue';
import { Place } from '@/models/place';
import ProgressIndicator from '@/components/ProgressIndicator.vue';

@Component({
  store,
  components: {
    Map,
    ProgressIndicator,
  },
  computed: mapState(['dataLoaded']),
})
export default class Home extends Vue {
  token =
    'pk.eyJ1IjoiYWtwMTAxIiwiYSI6ImNqeGtrbnVwazAxM2Izbm1vOWYwdHQxdjkifQ.gtLMDe9KAEU2rxBvk_vnzw';
  mapOptions = {
    style: 'mapbox://styles/akp101/cjxkkxwpc01x11cnur0aepitf/draft',
    center: [96.212739, 16.911199],
    zoom: 14.8,
    maxBounds: [
      [96.20043008891338, 16.899012663005408], // Southwest coordinates
      [96.22252355799174, 16.9239222243597], // Northeast coordinates
    ],
    bearing: -27.5, // rotation
    touchZoomRotate: true,
  };

  onLoaded(placeList: Array<Place>) {
    this.$store.commit('setPlaceList', placeList);
    this.$store.commit('setDataLoaded', true);
    this.$emit('loaded');
    // eslint-disable-next-line no-console
    console.log('Home: LOADED');
  }
}
</script>

<style lang="scss" scoped>
// // put ~ infront to import node_module
// //? can't find a way to import scss yet
// @import url('~animate.css/animate.css');
</style>

<template>
  <div id="map"></div>
</template>

<script lang="ts">
/* eslint-disable no-console */
import { Vue, Component, Prop } from 'vue-property-decorator';
import mapboxgl from 'mapbox-gl';
import { mapMutations } from 'vuex';
import { Place } from '@/models/place';
import eventBus from '@/eventBus';
import store from '@/store';
import { MapboxOptions } from 'mapbox-gl/index';
import MapService from '@/services/mapService';

@Component({
  methods: mapMutations(['setPlaceList', 'setDataLoaded']),
})
export default class Map extends Vue {
  @Prop()
  readonly mapOptions!: Object;

  @Prop()
  readonly token!: string;

  @Prop({
    type: Boolean,
    default: () => true,
  })
  readonly zoomControl!: Boolean;

  @Prop({
    type: Boolean,
    default: () => false,
  })
  readonly locationControl!: Boolean;

  options: MapboxOptions = {
    container: 'map',
    ...this.mapOptions,
  };

  mounted() {
    // ⚙️ CONFIG MAP
    mapboxgl.accessToken = this.token;
    let map = new mapboxgl.Map(this.$data.options);
    let mapService = new MapService(map);
    console.log(mapService);
    console.log(mapService.mapbox);
    this.$store.dispatch('configMapbox', mapService);
    // let marker = new mapboxgl.Marker({
    //   color: '#F85A40', // red
    // })
    //   .setLngLat([0, 0])
    //   .addTo(map);

    // 👂 LISTEN EVENTs
    // call after map data are fully loaded
    // map.on('load', () => {
    //   let cleanData = this.getCleanedPlaceData(map);
    //   this.$emit('loaded', cleanData);

    //   console.log('CLEAN DATA');
    //   console.log(cleanData);
    //   eventBus.$emit('loaded');
    // });

    // listen to mouse events as soon as the components are mounted.
    // remove highlight when user click/tap other area of the map (non-icon area)

    // eventBus.$on('removeHighlight', () => {
    //   removeHighlight();
    //   this.$router.replace('/');
    // });
    // eventBus.$on('highlightPlace', (place: Place) => {
    //   highlightPlace(place);
    // });
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

<style>
.mapboxgl-ctrl-top-right {
  top: 70px !important;
}
</style>

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
import { MAP_TOKEN } from '@/constants/const';

@Component({
  methods: mapMutations(['setPlaceList', 'setDataLoaded']),
})
export default class Map extends Vue {
  @Prop()
  readonly mapOptions!: Object;

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
    mapboxgl.accessToken = MAP_TOKEN;
    let map = new mapboxgl.Map(this.$data.options);
    this.$store.dispatch('configMapbox', new MapService(map));
  }
}
</script>

<style scoped>
@import url('~mapbox-gl/dist/mapbox-gl.css');
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
.mapboxgl-ctrl-top-left {
  top: 70px !important;
  z-index: 0;
}
</style>

/* eslint-disable no-console */
import Vue from 'vue';
import Vuex, { Getter } from 'vuex';
import { Place } from '@/models/place';
import mapboxgl from 'mapbox-gl';
import MapService from '@/services/mapService';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    searchClosed: true,
    dataLoaded: false,
    drawer: false,
    mapService: {} as MapService,
    places: Array<Place>(),
  },

  getters: {
    placeById: (state, getters) => (id: string) => {
      return state.places.find((place: Place) => place.properties.id == id);
    },

    getMapBox: (state) => state.mapService,
  },
  mutations: {
    setDataLoaded(state, value: boolean) {
      state.dataLoaded = value;
    },
    setDrawer(state, value: any) {
      state.drawer = value;
    },
    toggleDrawer(state) {
      state.drawer = !state.drawer;
    },
    openSearch(state) {
      state.searchClosed = false;
    },
    closeSearch(state) {
      state.searchClosed = true;
    },
    toggleSearch(state) {
      state.searchClosed = !state.searchClosed;
    },

    SET_PLACES(state, places: Place[]) {
      state.places = places;
    },

    SET_MAPSERVICE(state, mapService: MapService) {
      state.mapService = mapService;
    },
  },
  actions: {
    configMapbox(context, mapService: MapService) {
      console.log(mapService);
      console.log(mapService.mapbox);
      context.commit('SET_MAPSERVICE', mapService);
      mapService.mapbox.on('load', () => {
        context.commit('SET_PLACES', mapService.getPlaces());
        context.commit('setDataLoaded', true);
      });
    },
  },
  modules: {},
});

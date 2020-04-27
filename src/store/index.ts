/* eslint-disable no-console */
import Vue from 'vue';
import Vuex, { Getter } from 'vuex';
import { Place } from '@/models/place';
import mapboxgl from 'mapbox-gl';
import MapService from '@/services/mapService';
import { App } from '@/models/appState';
import router from '@/router';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appState: App.loading,
    drawer: false,
    mapService: {} as MapService,
    places: Array<Place>(),
  },

  getters: {
    placeById: (state, getters) => (id: string) => {
      return state.places.find((place: Place) => place.properties.id == id);
    },

    getMapBox: (state) => state.mapService,

    isLoading: (state) => state.appState == App.loading,
    isLoaded: (state) => state.appState == App.loaded,
    isSearching: (state) => state.appState == App.search,
  },
  mutations: {
    SET_DRAWER(state, value: any) {
      state.drawer = value;
    },

    SET_PLACES(state, places: Place[]) {
      state.places = places;
    },

    SET_MAPSERVICE(state, mapService: MapService) {
      state.mapService = mapService;
    },

    SET_APP_STATE(state, appStae: App) {
      state.appState = appStae;
    },

    REMOVE_HIGHLIGHT(state) {
      state.mapService.removeHighlight();
    },

    HIGHLIGHT_PLACE(state, place: Place) {
      state.mapService.highlightPlace(place);
    },
  },
  actions: {
    configMapbox(context, mapService: MapService) {
      // console.log(mapService);
      // console.log(mapService.mapbox);
      context.commit('SET_MAPSERVICE', mapService);
      mapService.mapbox.on('load', () => {
        context.commit('SET_PLACES', mapService.getPlaces());
        context.commit('SET_APP_STATE', App.loaded);
      });
    },

    openSearch(context) {
      context.commit('SET_APP_STATE', App.search);
    },
    closeSearch(context) {
      context.commit('SET_APP_STATE', App.loaded);
    },

    openDrawer(context) {
      context.commit('SET_DRAWER', true);
    },

    removeHighLight(context) {
      context.commit('REMOVE_HIGHLIGHT');
    },
    highLightPlace({ commit }, place: Place) {
      commit('HIGHLIGHT_PLACE', place);
      // router.push(`/place/${place.properties.id}`);
    },
  },
  modules: {},
});

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
    deferredPrompt: null,
    installable: false,
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
    SET_DRAWER(context, value: any) {
      context.drawer = value;
    },

    SET_PLACES(context, value: Place[]) {
      context.places = value;
    },

    SET_MAPSERVICE(context, value: MapService) {
      context.mapService = value;
    },

    SET_APP_STATE(context, value: App) {
      context.appState = value;
    },

    REMOVE_HIGHLIGHT(context) {
      context.mapService.removeHighlight();
    },

    HIGHLIGHT_PLACE(context, place: Place) {
      context.mapService.highlightPlace(place);
    },

    SET_DEFERRED_PROMPT(context, value: any) {
      context.deferredPrompt = value;
    },

    SET_INSTALLABLE(context, value: boolean) {
      context.installable = value;
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
    highLightPlace({ commit, dispatch }, place: Place) {
      dispatch('closeSearch');
      commit('HIGHLIGHT_PLACE', place);
      // router.push(`/place/${place.properties.id}`);
    },

    setDeferredPrompt(context, deferredPrompt: Event) {
      context.commit('SET_DEFERRED_PROMPT', deferredPrompt);
    },

    showInstall(context) {
      context.commit('SET_INSTALLABLE', true);
    },

    installPWA({ state, commit }) {
      if (state.deferredPrompt) {
        (state.deferredPrompt as any).prompt();
        // Wait for the user to respond to the prompt
        (state.deferredPrompt as any).userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
            // eslint-disable-next-line no-console
            console.log('User accepted the install prompt');
            commit('SET_INSTALLABLE', false);
          } else {
            // eslint-disable-next-line no-console
            console.log('User dismissed the install prompt');
          }
        });
      }
    },
  },
  modules: {},
});

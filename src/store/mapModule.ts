import MapService from '@/services/mapService';
import { Place } from '@/models/place';
import { Module } from 'vuex';
import { App } from '@/models/appState';

const mapModule: Module<any, any> = {
  state: () => ({
    mapService: {} as MapService,
    places: Array<Place>(),
  }),
  getters: {
    getMapBox: (state) => state.mapService,
    placeById: (state) => (id: string) => {
      return state.places.find((place: Place) => place.properties.id == id);
    },
  },
  mutations: {
    SET_MAPSERVICE(state, value: MapService) {
      state.mapService = value;
    },
    SET_PLACES(state, value: Place[]) {
      state.places = value;
    },
    REMOVE_HIGHLIGHT(state) {
      state.mapService.removeHighlight();
    },

    HIGHLIGHT_PLACE(state, place: Place) {
      state.mapService.highlightPlace(place);
    },
  },
  actions: {
    configMapbox({ commit }, mapService: MapService) {
      // set offline when loading take more than 10s
      let networkTimeout = setTimeout(() => {
        commit('SET_OFFLINE', true);
      }, 10 * 1000);
      commit('SET_MAPSERVICE', mapService);
      mapService.mapbox.on('load', () => {
        clearTimeout(networkTimeout);
        commit('SET_PLACES', mapService.getPlaces());
        commit('SET_APP_STATE', App.loaded);
      });
    },
  },
};

export default mapModule;

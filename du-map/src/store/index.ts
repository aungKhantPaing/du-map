import Vue from 'vue';
import Vuex from 'vuex';
import { Place } from '@/models/place';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    searchClosed: true,
    dataLoaded: false,
    placeList: Array<Place>(),
    drawer: false,
  },
  getters: {
    getPlace: (state) => (id: string) => {
      return state.placeList.find((place) => place.properties.id == id);
    },
    getPlaceList() {
      return this.placeList;
    },
  },
  mutations: {
    setDataLoaded(state, value: boolean) {
      state.dataLoaded = value;
    },
    setPlaceList(state, value: Place[]) {
      state.placeList = value;
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
  },
  actions: {},
  modules: {},
});

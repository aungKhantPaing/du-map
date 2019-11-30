import Vue from 'vue';
import Vuex from 'vuex';
import { Place } from '@/models/place';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dataLoaded: false,
    placeList: Array<Place>(),
    drawer: null,
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
  },
  actions: {},
  modules: {},
});

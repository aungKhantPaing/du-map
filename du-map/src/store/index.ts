import Vue from 'vue';
import Vuex from 'vuex';
import { PlaceList } from '@/models/placeList';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dataLoaded: false,
    placeLists: [],
  },
  mutations: {
    setDataLoaded(state: any, value: boolean) {
      state.dataLoaded = value;
    },
    setPlaceLists(state: any, value: PlaceList[]) {
      state.placeLists = value;
    }
  },
  actions: {},
  modules: {},
});

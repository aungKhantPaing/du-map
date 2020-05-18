/* eslint-disable no-console */
import Vue from 'vue';
import Vuex from 'vuex';
import { Place } from '@/models/place';
import { App } from '@/models/appState';
import mapModule from './mapModule';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appState: App.loading,
    drawer: false,
    deferredPrompt: null,
    installable: false,
    offline: false,
    searchText: '',
  },
  getters: {
    isLoading: (state) => state.appState == App.loading,
    isLoaded: (state) => state.appState == App.loaded,
    isSearching: (state) => state.appState == App.search,
  },
  mutations: {
    SET_DRAWER(context, value: boolean) {
      context.drawer = value;
    },
    SET_APP_STATE(context, value: App) {
      context.appState = value;
    },
    SET_DEFERRED_PROMPT(context, value: any) {
      context.deferredPrompt = value;
    },
    SET_INSTALLABLE(context, value: boolean) {
      context.installable = value;
    },
    SET_OFFLINE(state, value: boolean) {
      state.offline = value;
    },
    SET_SEARCH_TEXT(state, value: string) {
      state.searchText = value;
    },
  },
  actions: {
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
    setSearch({ commit }, value: string) {
      commit('SET_SEARCH_TEXT', value);
    },
    installPWA({ state, commit }) {
      if (state.deferredPrompt) {
        (state.deferredPrompt as any).prompt();
        // Wait for the user to respond to the prompt
        (state.deferredPrompt as any).userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
            commit('SET_INSTALLABLE', false);
          } else {
            console.log('User dismissed the install prompt');
          }
        });
      }
    },
  },
  modules: {
    map: mapModule,
  },
});

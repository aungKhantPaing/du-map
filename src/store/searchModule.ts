import { Module } from 'vuex';

const searchModule: Module<any, any> = {
  state: {
    searchBar: false,
    searchText: '',
  },
  getters: {
    isSearching: (state) => state.searchBar,
    getSearchText: (state) => state.searchText,
  },
  mutations: {
    SET_SEARCH_TEXT(state, value: string) {
      state.searchText = value;
    },
    SET_SEARCH_BAR(state, value: boolean) {
      state.searchBar = value;
    },
  },
  actions: {
    openSearch({ commit }) {
      commit('SET_SEARCH_BAR', true);
    },
    closeSearch({ commit }) {
      commit('SET_SEARCH_BAR', false);
    },
    setSearch({ commit }, value: string) {
      commit('SET_SEARCH_TEXT', value);
    },
  },
};

export default searchModule;

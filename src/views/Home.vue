<template>
  <v-app>
    <Map :map-options="mapOptions" location-control />

    <div v-if="!isLoading">
      <app-bar class="animated fadeInDown faster appbar" />
      <navi-drawer />

      <v-container fluid class="bottom-container">
        <v-row no-gutters>
          <v-container class="d-flex justify-end pa-0">
            <div class="fab-container">
              <Fab v-show="!isSearching" @click="openSearch()">
                <v-icon>mdi-magnify</v-icon>
              </Fab>

              <Fab v-show="isSearching" @click="closeSearch()" color="warning">
                <v-icon>mdi-close</v-icon>
              </Fab>
            </div>
          </v-container>

          <transition name="slide-fade" mode="out-in">
            <router-view :key="$route.fullPath"></router-view>
          </transition>
        </v-row>
      </v-container>
    </div>

    <progress-indicator :show="isLoading" />
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import store from '@/store';
import { mapState, mapGetters, mapActions } from 'vuex';
import Map from '@/components/Map.vue';
import ProgressIndicator from '@/components/ProgressIndicator.vue';
import AppBar from '@/components/AppBar.vue';
import NaviDrawer from '@/components/NaviDrawer.vue';
import Fab from '@/components/Fab.vue';
import { Place } from '@/models/place';
import eventBus from '@/eventBus';

@Component({
  store,
  components: {
    Map,
    ProgressIndicator,
    AppBar,
    Fab,
    NaviDrawer,
  },
  computed: {
    ...mapState(['dataLoaded', 'searchClosed']),
    ...mapGetters(['isLoading', 'isSearching']),
  },
  methods: {
    ...mapActions(['openSearch', 'closeSearch']),
  },
})
export default class Home extends Vue {
  mapOptions = {
    style: 'mapbox://styles/akp101/cjxkkxwpc01x11cnur0aepitf/draft',
    center: [96.212739, 16.911199],
    zoom: 14.8,
    maxBounds: [
      [96.20043008891338, 16.899012663005408], // Southwest coordinates
      [96.22252355799174, 16.9239222243597], // Northeast coordinates
    ],
    bearing: -27.5, // rotation
    touchZoomRotate: true,
  };

  onLoaded(placeList: Array<Place>) {
    this.$store.commit('setPlaceList', placeList);
    this.$store.commit('setDataLoaded', true);
    this.$emit('loaded');
    // eslint-disable-next-line no-console
    console.log('Home: LOADED');
  }

  openSearch() {
    store.dispatch('openSearch');
  }

  closeSearch() {
    store.dispatch('closeSearch');
  }
}
</script>

<style scoped>
/* 📝 put ~ infront to import from node_module */
/* can't find a way to import scss yet */
@import url('~animate.css/animate.css');

.bottom-container {
  position: fixed;
  bottom: 0px !important;
  padding: 0px;
  pointer-events: none !important;
  z-index: 1;
}
.appbar {
  position: absolute;
  z-index: 2 !important;
}
.fab-container {
  pointer-events: all !important;
  position: relative !important;
}

/* ⏲ TRANSITIONS */
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
.slide-fade-enter-active {
  transition: all 0.2s ease-in;
}
.slide-fade-leave-active {
  transition: all 0.05s ease-out;
}
</style>

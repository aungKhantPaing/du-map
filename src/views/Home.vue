<template>
  <v-app>
    <Map :map-options="mapOptions" :token="token" location-control />

    <div v-if="!isLoading">
      <app-bar class="animated fadeInDown faster layer-3" />

      <navi-drawer />
      <!-- Dock -->
      <router-view :key="$route.fullPath" class="animated fadeInUp faster layer-3"></router-view>

      <v-btn
        v-show="!isSearching"
        @click="openSearch()"
        fixed
        dark
        right
        :elevation="6"
        color="primary"
        class="fab animated fadeInRight faster"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn
        v-show="isSearching"
        @click="closeSearch()"
        fixed
        dark
        right
        :elevation="6"
        color="warning"
        class="fab animated fadeInRight faster"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <progress-indicator :show="isLoading" />
  </v-app>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import store from '@/store';
import { mapState, mapGetters } from 'vuex';
import Map from '@/components/Map.vue';
import ProgressIndicator from '@/components/ProgressIndicator.vue';
import AppBar from '@/components/AppBar.vue';
import NaviDrawer from '@/components/NaviDrawer.vue';
import { Place } from '@/models/place';
import eventBus from '@/eventBus';

@Component({
  store,
  components: {
    Map,
    ProgressIndicator,
    AppBar,
    NaviDrawer,
  },
  computed: {
    ...mapState(['dataLoaded', 'searchClosed']),
    ...mapGetters(['isLoading', 'isSearching']),
  },
})
export default class Home extends Vue {
  token =
    'pk.eyJ1IjoiYWtwMTAxIiwiYSI6ImNqeGtrbnVwazAxM2Izbm1vOWYwdHQxdjkifQ.gtLMDe9KAEU2rxBvk_vnzw';
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
    eventBus.$emit('openSearch');
  }

  closeSearch() {
    eventBus.$emit('closeSearch');
  }
}
</script>

<style lang="scss" scoped>
// put ~ infront to import node_module
//? can't find a way to import scss yet
@import url('~animate.css/animate.css');

.layer-3 {
  z-index: 3 !important;
}

.fab {
  min-height: 0;
  min-width: 0;
  padding: 0;
  height: 56px !important;
  width: 56px !important;
  bottom: 110px !important;
  right: 0px !important;
  border-radius: 20% 0% 0% 20% !important;
}
</style>

<template>
  <div class="bar-container">
    <!-- app bar -->
    <v-app-bar absolute class="responsive-bar" :collapse="searchClosed" color="primary" app dark>
      <v-btn text icon @click="toggleDrawer()">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-text-field
        v-model.lazy="searchText"
        class="mt-6"
        v-if="!searchClosed"
        @blur="onBlur()"
        @keydown.esc="collapseBar()"
        solo
        dense
        light
        full-width
        autofocus
        placeholder="Search"
      ></v-text-field>

      <v-btn v-show="searchClosed" text icon @click="onLayerClick()">
        <v-icon>mdi-layers</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- search result -->
    <v-card v-if="searchIsBusy" class="mt-12 responsive-container" color="transparent" flat>
      <v-list dense>
        <v-subheader>Results</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="{ item } in filteredPlaces"
            @click="goTo(item)"
            :key="item.properties.id"
          >
            <v-list-item-title v-text="item.properties.name"></v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapState, mapMutations } from 'vuex';
import eventBus from '@/eventBus';
import { Place } from '@/models/place';
import Fuse from 'fuse.js';

@Component({
  computed: {
    ...mapState(['drawer', 'searchClosed']),
  },
  methods: {
    ...mapMutations(['toggleDrawer']),
  },
})
export default class AppBar extends Vue {
  width = '80';
  searchText = '';
  fuse = new Fuse<Place, Fuse.FuseOptions<Place>>(this.$store.state.placeList, {
    shouldSort: true,
    includeMatches: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['properties.name', 'properties.type'],
  });

  collapseBar() {
    this.$store.commit('closeSearch');
    this.searchText = '';
  }

  expandBar() {
    this.$store.commit('openSearch');
  }

  onBlur() {
    if (!this.searchIsBusy) {
      this.collapseBar();
    }
  }

  goTo(place: Place) {
    this.searchText = '';
    this.collapseBar();
    this.$router.push(`/place/${place.properties.id}`);
  }

  get searchIsBusy() {
    return this.searchText.length > 0 && this.filteredPlaces.length > 0;
  }

  get filteredPlaces() {
    return this.fuse.search<Array<Place>>(this.searchText);
  }

  get right() {
    let width = window.innerWidth > 0 ? window.innerWidth : screen.width;
    // eslint-disable-next-line no-console
    console.log(width);
    let isMobile = width >= 320 && width <= 767;
    return isMobile ? '0' : '50%';
  }

  mounted() {
    eventBus.$on('openSearch', () => {
      this.expandBar();
    });

    eventBus.$on('clearSearch', () => {
      this.collapseBar();
    });
  }
}
</script>

<style lang="scss" scoped>
.responsive-bar {
  // mobile
  @media (min-width: 320px) and (max-width: 480px) {
    right: 0 !important;
  }
  // else
  right: 50% !important;
}

.responsive-container {
  position: fixed !important;
  left: 0 !important;
  right: 0 !important;

  // mobile
  @media (min-width: 320px) and (max-width: 600px) {
    width: 100% !important;
  }
  // else
  width: 50% !important;
}

.bar-container {
  position: fixed;
  width: 100%;
}
</style>

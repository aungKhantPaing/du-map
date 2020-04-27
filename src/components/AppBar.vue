<template>
  <v-col class="bar-container" sm="6">
    <!-- app bar -->
    <v-app-bar absolute :collapse="!isSearching" color="primary" app dark>
      <v-btn text icon @click="openDrawer()">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-text-field
        v-model.lazy="searchText"
        class="mt-6"
        v-if="isSearching"
        @blur="onBlur()"
        @keydown.esc="collapseBar()"
        @click:clear="clearText()"
        placeholder="Search"
        solo
        dense
        light
        full-width
        autofocus
        clearable
      ></v-text-field>

      <!-- <v-btn v-show="!isSearching" text icon @click="onLayerClick()">
        <v-icon>mdi-layers</v-icon>
      </v-btn> -->
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
            class=""
          >
            {{ item.properties.name }}
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
import eventBus from '@/eventBus';
import { Place } from '@/models/place';
import Fuse from 'fuse.js';
// import gsap from 'gsap';

@Component({
  computed: {
    ...mapState(['drawer', 'searchClosed']),
    ...mapGetters(['isSearching']),
  },
  methods: {
    ...mapActions(['openDrawer']),
  },
})
export default class AppBar extends Vue {
  searchText = '';
  fuse = new Fuse<Place, Fuse.FuseOptions<Place>>(this.$store.state.places, {
    shouldSort: true,
    includeMatches: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['properties.name', 'properties.type', 'properties.id'],
  });

  clearText() {
    this.searchText = '';
  }

  collapseBar() {
    this.$store.dispatch('closeSearch');
    this.clearText();
  }

  expandBar() {
    this.$store.dispatch('openSearch');
  }

  onBlur() {
    if (!this.searchIsBusy) this.collapseBar();
  }

  goTo(place: Place) {
    this.collapseBar();
    this.$router.push(`/place/${place.properties.id}`);
  }

  get searchIsBusy() {
    return this.searchText && this.searchText.length && this.filteredPlaces.length;
  }

  get filteredPlaces() {
    return this.fuse.search<Array<Place>>(this.searchText || '');
  }

  mounted() {
    eventBus.$on('openSearch', () => {
      this.expandBar();
    });

    eventBus.$on('closeSearch', () => {
      this.collapseBar();
    });

    // gsap.from('.list-item', {
    //   duration: 0.5,
    //   opacity: 0,
    //   y: 200,
    //   ease: 'power1',
    //   stagger: 0.1,
    // });
  }
}
</script>

<style lang="scss" scoped>
// .responsive-bar {
//   // mobile
//   @media (min-width: 320px) and (max-width: 480px) {
//     right: 0 !important;
//   }
//   // else
//   right: 50% !important;
// }

.responsive-container {
  position: fixed !important;
  left: 0 !important;
  right: 0 !important;
}

.bar-container {
  position: fixed;
  width: 100%;
}
</style>

<template>
  <v-col sm="6" class="pa-0">
    <!-- app bar -->
    <v-app-bar :collapse="!isSearching" color="primary" style="position: sticky;" app dark>
      <v-btn text icon @click="openDrawer()">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <!-- 📝 @input/:value is more sutiable than v-model for mobile ux -->
      <!-- 👨‍🏫 Even You explained why: https://github.com/vuejs/vue/issues/9777#issuecomment-478831263 -->
      <v-text-field
        :value.sync="searchText"
        @input="(input) => (searchText = input)"
        @blur="onBlur()"
        @keydown.esc="collapseBar()"
        @click:clear="clearText()"
        clearable
        autofocus
        v-if="isSearching"
        placeholder="Search"
        class="mt-6"
        solo
        dense
        light
        full-width
      ></v-text-field>

      <!-- <v-btn v-show="!isSearching" text icon @click="onLayerClick()">
        <v-icon>mdi-layers</v-icon>
      </v-btn> -->
    </v-app-bar>

    <!-- search result -->
    <v-card v-if="searchIsBusy && isSearching" color="transparent" flat>
      <v-list subheader>
        <v-subheader>Results</v-subheader>
        <v-list-item
          v-for="{ item } in filteredPlaces"
          @click="goTo(item)"
          :key="item.properties.id"
          class=""
          ><place-icon class="mr-2" :place-type="item.properties.type"></place-icon>
          {{ item.properties.name }}
        </v-list-item>
      </v-list>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
import eventBus from '@/eventBus';
import { Place } from '@/models/place';
import PlaceIcon from '@/components/PlaceIcon.vue';
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
  components: { PlaceIcon },
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
</style>

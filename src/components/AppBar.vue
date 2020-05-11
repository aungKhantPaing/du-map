<template>
  <v-col sm="6" lg="3" class="appbar-container">
    <!-- app bar -->
    <v-app-bar
      :collapse="!isSearching"
      :min-width="appBarWidth"
      color="primary"
      class="appbar"
      app
      dark
    >
      <v-btn text icon @click="openDrawer()">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-btn v-if="installable && !isSearching" text @click="installPWA()">
        Install
      </v-btn>

      <!-- 📝 @input/:value is more sutiable than v-model for mobile ux -->
      <!-- 👨‍🏫 Even You explained why: https://github.com/vuejs/vue/issues/9777#issuecomment-478831263 -->

      <!-- <v-text-field
        v-model="searchText"
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
      ></v-text-field> -->

      <text-field
        :show="isSearching"
        :value="searchText"
        @input.passive="onInput"
        focus
      ></text-field>
    </v-app-bar>

    <!-- search result -->
    <v-card v-if="searchIsBusy && isSearching" color="transparent" flat>
      <v-list subheader>
        <v-subheader>Results</v-subheader>
        <v-list-item
          v-for="{ item } in filteredPlaces"
          @click="onClick(item)"
          :key="item.properties.id"
        >
          <place-icon class="mr-2" :place-type="item.properties.type"></place-icon>
          {{ item.properties.name }}
          <v-chip
            small
            v-if="item.properties.type == 'department'"
            class="ml-1"
            color="teal"
            text-color="white"
          >
            {{ item.properties.buildingsString }}
          </v-chip>
          <span v-if="item.properties.note" style="color:grey;">{{
            ` (${item.properties.note})`
          }}</span>
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
import TextField from '@/components/TextField.vue';
import Fuse from 'fuse.js';
// import gsap from 'gsap';

@Component({
  computed: {
    ...mapState(['drawer', 'searchClosed', 'installable']),
    ...mapGetters(['isSearching']),
  },
  methods: {
    ...mapActions(['openDrawer', 'installPWA']),
  },
  components: { PlaceIcon, TextField },
})
export default class AppBar extends Vue {
  fuse = new Fuse<Place, Fuse.FuseOptions<Place>>(Array.from(this.$store.state.places), {
    shouldSort: true,
    includeScore: false,
    includeMatches: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,

    keys: ['properties.name', 'properties.type', 'properties.buildingsString'],
  });
  searchText = '';

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

  onClick(place: Place) {
    this.collapseBar();
    this.$router.push(`/place/${place.properties.id}`);
  }

  onInput(value: any) {
    this.searchText = value;
  }

  get searchIsBusy() {
    return this.searchText && this.searchText.length && this.filteredPlaces.length;
  }

  get filteredPlaces() {
    return this.fuse.search<Array<Place>>(this.searchText || '');
  }

  get appBarWidth() {
    return this.$store.state.installable ? '156px' : '';
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

.appbar-container {
  padding: 0px;
  pointer-events: none;
  > * {
    pointer-events: all;
  }
  .appbar {
    position: sticky !important;
  }
}
</style>

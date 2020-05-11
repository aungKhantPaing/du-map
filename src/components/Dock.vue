<template>
  <v-row class="dock">
    <v-col class="pa-0" sm="6" offset-sm="6">
      <v-card class="dock-header">
        <div v-ripple @click="toggleExpand" class="place-label-container">
          <v-row align="center" justify="space-between" no-gutters>
            <!-- 📝'no-gutters' remove🔪gutter between v-cols. -->
            <v-col>
              <p class="headline mb-2">{{ place.properties.name }}</p>
              <v-row no-gutters>
                <chip-label
                  :value="place.properties.type"
                  :theme="getThemeOf(place.properties.type)"
                  style="margin: 0px 4px 4px 0px;"
                ></chip-label>
                <v-chip
                  v-if="place.properties.type == 'department'"
                  color="teal"
                  text-color="white"
                >
                  {{ placeBuildings }}
                </v-chip>
              </v-row>
            </v-col>
            <!-- <v-spacer></v-spacer> -->

            <v-chip
              @touchstart.stop
              @mousedown.stop
              @click.stop="share()"
              outlined
              large
              color="black"
            >
              <v-avatar left>
                <v-icon>mdi-share-variant</v-icon>
              </v-avatar>
              Share
            </v-chip>
          </v-row>
        </div>

        <div v-if="expanded">
          <v-list-item>
            <v-list-item-title>{{ note }}</v-list-item-title>
          </v-list-item>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
/* eslint-disable no-console */
import eventBus from '@/eventBus';
import store from '@/store';
import { Route } from 'vue-router';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Place } from '@/models/place';
import { Watch } from 'vue-property-decorator';
import ChipLabel from './ChipLabel.vue';
import place_types from '@/constants/placeType';
import kPlaceToTheme from '@/constants/placeToTheme';

@Component({
  components: { ChipLabel },
  beforeRouteLeave: (to, from, next) => {
    store.dispatch('removeHighLight');
    next();
  },
})
export default class Dock extends Vue {
  place: Place = (this.$attrs.place as unknown) as Place;
  expanded: Boolean = false;

  get lngLat() {
    return this.place.geometry.coordinates;
  }

  get phones() {
    return this.place.properties.phones;
  }

  get note() {
    return this.place.properties.note;
  }

  get placeBuildings() {
    return this.place.properties.buildings.reduce((prev, curr) => `${prev}, ${curr}`);
  }

  getThemeOf(value: place_types) {
    return kPlaceToTheme[value];
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  share() {}

  mounted() {
    // dispatch after mounted. need to wait for the mapbox to complete loading.
    store.dispatch('highLightPlace', store.getters.placeById(this.place.properties.id));
    console.log(this.place);
  }

  // @Watch('$route')
  // onRouteChange(to: Route, from: Route) {
  //   // update current place on route change
  //   let nextPlace: Place = store.getters.placeById(to.params.id);
  //   eventBus.$emit('highlightPlace', nextPlace);
  //   this.place = nextPlace;
  // }
}
</script>

<style lang="scss" scoped>
.dock {
  margin: 0;
  pointer-events: none;

  .dock-header {
    cursor: auto;
    pointer-events: all;
  }

  .place-label-container {
    cursor: pointer;
    padding: 10px !important;
    margin: 0 !important;
    .headline {
      display: flex !important;

      align-items: center;
      user-select: none;
    }
    .subtitle {
      display: flex;
      align-items: center;
      margin: 8px !important;
      text-transform: capitalize;
      color: gray;
      user-select: none;

      i {
        margin-right: 10px !important;
      }

      .badge {
        color: white;
        background-color: #26a69a;
        font-size: 1rem !important;
        padding-top: 1px;
        margin-left: 10px !important;
      }
    }
  }
}
</style>

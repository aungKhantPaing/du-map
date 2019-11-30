<template>
  <v-row class="dock">
    <v-col class="pa-0" md="6" offset-md="6">
      <v-card v-ripple class="dock-header">
        <!-- <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>{{ place.properties.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ place.properties.type }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item> -->
        <div class="place-label-container">
          <p class="headline">{{ place.properties.name }}</p>
          <chip-label class="ml-2" :rules="chipRules" :value="place.properties.type"></chip-label>
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
import ChipLabel, { ChipProperties } from '@/components/ChipLabel.vue';
import place_types from '@/constants/placeType';

@Component({
  components: { ChipLabel },
})
export default class Dock extends Vue {
  place: Place = (this.$attrs.place as unknown) as Place;
  chipRules: Record<string, ChipProperties> = {
    default: { icon: 'mdi-domain', color: 'grey' },

    department: { icon: 'mdi-bank', color: '#1976d2' },
    canteen: { icon: 'mdi-silverware', color: '#f85a40' },
    'bus stop': { icon: 'mdi-bus', color: 'yellow darken-3' },
    library: { icon: 'mdi-library', color: '#795548' },
    hostel: { icon: 'mdi-hotel', color: 'pink' },
    hall: { icon: 'mdi-school', color: 'teal accent-4' },
  };

  mounted() {
    eventBus.$emit('highlightPlace', this.place);
  }

  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    let nextPlace: Place = store.getters.getPlace(to.params.id);
    eventBus.$emit('highlightPlace', nextPlace);
    this.place = nextPlace;
  }
}
</script>

<style lang="scss" scoped>
.dock {
  z-index: 3;
  position: fixed;
  pointer-events: none;
  bottom: 0;
  margin: 0;
  width: 100%;

  .dock-header {
    cursor: auto;
    pointer-events: all;
  }

  // .dock-header {
  //   cursor: auto;
  //   pointer-events: all;
  //   display: flex !important;
  //   align-items: center;
  //   margin: 0 !important;
  //   height: fit-content !important;
  //   border-radius: 6px 6px 0px 0px;
  //   transition: 1s;
  //   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu,
  //     Cantarell, 'Helvetica Neue', sans-serif !important;
  //   // border-radius: 11px 11px 0px 0px;

  .place-label-container {
    cursor: pointer;
    padding: 10px 0px 10px 14px !important;
    margin: 0 !important;
    .headline {
      display: flex !important;
      align-items: center;
      margin: 8px !important;
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
  // }
}
</style>

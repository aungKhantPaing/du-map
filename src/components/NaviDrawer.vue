<template>
  <v-navigation-drawer v-model="drawer" absolute temporary app width="300">
    <v-list nav subheader>
      <v-subheader>Places</v-subheader>
      <v-list-group
        v-for="placeGroup in placeGroups"
        :key="placeGroup.name"
        :prepend-icon="placeGroup.icon"
      >
        <template v-slot:activator>
          <v-list-item-title class="subtitle-1">{{ placeGroup.name }}</v-list-item-title>
        </template>

        <template v-slot:default>
          <v-list-item
            v-for="place in placeGroup.placeList"
            @click="goTo(place)"
            :key="place.properties.id"
          >
            <v-list-item-title
              style="margin-left: 56px;"
              class="body-1"
              v-text="place.properties.name"
            >
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import PlaceGroup from '@/models/placeGroup';
import place_types from '@/constants/placeType';
import eventBus from '@/eventBus';
import store from '@/store';
import { Place } from '@/models/place';
import kPlaceToTheme from '@/constants/placeToTheme';

@Component
export default class NaviDrawer extends Vue {
  // as v-model do both getting and setting the value...
  // ...computed setter is a handy way to link v-model with vuex
  set drawer(value: boolean) {
    this.$store.commit('setDrawer', value);
  }
  get drawer() {
    return this.$store.state.drawer;
  }

  getColorOf(value: place_types) {
    return kPlaceToTheme[value].color;
  }

  goTo(place: Place) {
    this.$router.push(`/place/${place.properties.id}`);
  }

  placeGroups: PlaceGroup[] = [
    new PlaceGroup('Department', [place_types.department], 'mdi-bank'),
    new PlaceGroup('Canteen', [place_types.canteen], 'mdi-silverware'),
    new PlaceGroup('Bus Stop', [place_types.bus_stop], 'mdi-bus'),
    new PlaceGroup(
      'Sport and Activities',
      [place_types.rc, place_types.library, place_types.stadium],
      'mdi-run',
    ),
    new PlaceGroup('Copier', [place_types.copier], 'mdi-content-copy'),
    new PlaceGroup('Hostel', [place_types.hostel], 'mdi-hotel'),
    new PlaceGroup('Other', [], 'mdi-domain'),
  ];

  mounted() {
    this.$store.state.places.forEach((place: Place) => {
      for (const placeGroup of this.placeGroups) {
        if (placeGroup.types.includes(place.properties.type) || placeGroup.types.length == 0) {
          placeGroup.placeList.push(place);
          break;
        }
      }
    });
  }
}
</script>

<style></style>

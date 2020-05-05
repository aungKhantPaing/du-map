<template>
  <v-avatar size="30" :color="theme.color">
    <v-icon small color="white">{{ theme.icon }}</v-icon>
  </v-avatar>
</template>

<script>
import place_types from '@/constants/placeType';
import kPlaceToTheme from '@/constants/placeToTheme';
export default {
  props: {
    placeType: {
      type: String,
      default: place_types.other.toString(),
    },
  },
  computed: {
    theme() {
      return kPlaceToTheme[this.placeType]
        ? kPlaceToTheme[this.placeType]
        : kPlaceToTheme[place_types.other];
    },
  },
};
</script>

<style></style>

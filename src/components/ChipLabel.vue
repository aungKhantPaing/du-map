<template>
  <v-chip text-color="white" class="text-capitalize" :color="theme.color">
    <v-avatar left small color="white">
      <v-icon color="#263238" small>{{ theme.icon }}</v-icon>
    </v-avatar>

    {{ value }}
  </v-chip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import kPlaceToTheme from '@/constants/placeToTheme';
import place_types from '../constants/placeType';
import Theme from '@/models/theme';

@Component
export default class ChipLabel extends Vue {
  @Prop({
    required: true,
  })
  readonly theme!: Theme;
  @Prop({
    required: true,
  })
  readonly value!: string;
}
</script>

<style></style>

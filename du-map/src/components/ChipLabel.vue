<template>
  <v-chip text-color="white" class="text-capitalize" :color="color">
    <v-avatar left small color="white">
      <v-icon color="#263238" small>{{ icon }}</v-icon>
    </v-avatar>

    {{ value }}
  </v-chip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ChipLabel extends Vue {
  @Prop({
    required: true,
  })
  readonly rules!: Record<string, ChipProperties>;
  @Prop({
    required: true,
  })
  readonly value!: string;

  get icon() {
    return this.value in this.rules ? this.rules[this.value].icon : this.rules['default'].icon;
  }

  get color() {
    return this.value in this.rules ? this.rules[this.value].color : this.rules['default'].color;
  }
}

export interface ChipProperties {
  icon: string;
  color: string;
}
</script>

<style></style>

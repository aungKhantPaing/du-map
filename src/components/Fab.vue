<template>
  <v-fab-transition>
    <v-btn
      @click="onClick()"
      dark
      fab
      absolute
      bottom
      right
      :elevation="6"
      :color="color"
      class="fab"
    >
      <slot> </slot>
    </v-btn>
  </v-fab-transition>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Fab extends Vue {
  @Prop({
    default: 'primary',
  })
  color!: String;

  onClick() {
    this.$emit('click');
  }
}
</script>

<style scoped>
.fab {
  margin: 0px 0px 40px 0px;
}
</style>

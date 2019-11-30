<template>
  <div></div>
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

@Component
export default class Dock extends Vue {
  place: Place = (this.$attrs.place as unknown) as Place;

  mounted() {
    eventBus.$emit('highlightPlace', this.place);
  }

  @Watch('$route')
  onRouteChange(to: Route, from: Route) {
    eventBus.$emit('highlightPlace', store.getters.getPlace(to.params.id));
  }
}
</script>

<style></style>

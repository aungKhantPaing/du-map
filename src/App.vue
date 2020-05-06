<template>
  <router-view></router-view>
</template>

<script lang="ts">
import Vue from 'vue';
import { App } from '@/models/appState';
export default Vue.extend({
  data: () => ({
    //
  }),
  mounted() {
    // if (!window.navigator.onLine) {
    //   this.$router.replace('/offline');
    // }
  },
});
</script>

<template>
  <router-view></router-view>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    //
  }),
  mounted() {
    window.addEventListener('load', () => {
      window.addEventListener('offline', () => {
        this.$store.dispatch('turnOffline');
      });
    });
  },
});
</script>

<template>
  <router-view></router-view>
</template>

<script lang="ts">
let logo = window.origin + require('./assets/logo.png');
import Vue from 'vue';
import { App } from '@/models/appState';
export default Vue.extend({
  data() {
    return {
      metaInfo: {
        // if no subcomponents specify a metaInfo.title, this title will be used
        title: 'DU Map',
        // all titles will be injected into this template
        // titleTemplate: '%s | My Awesome Webapp',
        meta: [
          // Twitter Card
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: 'DU Map' },
          {
            name: 'twitter:description',
            content: 'Find your way in Dagon University.',
          },
          // image must be an absolute path
          { name: 'twitter:image', content: logo },
          // Facebook OpenGraph
          { property: 'og:title', content: 'DU Map' },
          { property: 'og:site_name', content: 'DU Map' },
          { property: 'og:type', content: 'website' },
          { property: 'og:image', content: logo },
          {
            property: 'og:description',
            content: 'Find your way in Dagon University.',
          },
        ],
      },
    };
  },
  mounted() {
    // if (!window.navigator.onLine) {
    //   this.$router.replace('/offline');
    // }
  },
});
</script>

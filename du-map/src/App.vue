<template>
  <div id="app">
    <Map></Map>
    <!-- TODO: add progress bar -->
    <!-- TODO: add side bar -->
  </div>
</template>

<script lang="ts">
import Map from "@/views/components/Map.vue";
import store from "./store";
import { mapState } from "vuex";

export default {
  store,
  components: {
    Map
  },
  computed: mapState(["dataLoaded", "placeLists"])
};
</script>

<style lang="scss" scoped>
//? can't find a way to import scss yet
//* put '~' in front of directory to import node_module

// @import url("~materialize-css/dist/css/materialize.css");
/*
  materialize-css is currently vulnerable to Cross-Site Scripting
  more detail: https://www.npmjs.com/advisories/817
*/

// .progress-container {
//   height: 100vh;
//   .progress {
//     position: fixed;
//     top: 50vh;
//     .indeterminate {
//       width: 70%;
//     }
//   }
// }
</style>

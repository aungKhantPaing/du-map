<template>
  <router-view></router-view>
</template>

<script lang="ts">
import Map from "@/views/components/Map.vue";
import Vue from "vue";
import store from "@/store";
import { mapState } from "vuex";

export default {
  name: "App",
  store
  // computed: mapState(["dataLoaded", "placeLists"])
};
</script>

<style lang="scss" scoped></style>

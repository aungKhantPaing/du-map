<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <Map></Map>

    <!-- Progress Indicator -->
    <v-container v-if="!dataLoaded" class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="8">
          <v-progress-linear
            :active="true"
            indeterminate
            color="teal"
            :rounded="true"
            height="8"
          ></v-progress-linear>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Map from "@/views/components/Map.vue";
import store from "@/store";
import { mapState } from "vuex";

export default {
  name: "Home",
  store,
  components: {
    Map
  },
  computed: mapState(["dataLoaded", "placeLists"]),
  data: () => ({})
};
</script>

<style lang="scss" scoped></style>

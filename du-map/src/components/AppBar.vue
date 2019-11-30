<template>
  <v-app-bar app color="primary" dark>
    <!-- <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
      </div> -->
    <v-btn text icon @click="setDrawer(!drawer)">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { mapState, mapMutations } from 'vuex';

@Component({
  computed: {
    ...mapState(['drawer']),
  },
  methods: {
    ...mapMutations(['setDrawer']),
  },
})
export default class AppBar extends Vue {}
</script>

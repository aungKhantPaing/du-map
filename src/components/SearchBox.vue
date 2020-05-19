<template>
  <!-- 📝 @input/:value is more sutiable than v-model for mobile ux -->
  <!-- 👨‍🏫 Even You explained: https://github.com/vuejs/vue/issues/9777#issuecomment-478831263 -->
  <v-text-field
    :value="getSearchText"
    @input="onInput"
    @blur="onBlur()"
    @keydown.esc="collapseBar()"
    @click:clear="clearSearch()"
    placeholder="Search"
    clearable
    autofocus
    solo
    dense
    full-width
    light
    class="mt-6"
  ></v-text-field>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
export default {
  beforeMount() {
    this.$store.dispatch('openSearch');
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('closeSearch');
    next();
  },
  computed: {
    ...mapGetters(['getSearchText']),
  },
  methods: {
    ...mapActions(['openSearch', 'closeSearch']),

    collapseBar() {
      this.$store.dispatch('closeSearch');
      this.clearSearch();
      this.$router.back();
    },
    clearSearch() {
      this.$store.dispatch('setSearch', '');
    },
    onBlur() {
      if (!this.searchIsBusy) {
        // this.collapseBar();
        // eslint-disable-next-line no-console
        console.log('BLURED');
      }
    },
    onInput(value) {
      this.$store.dispatch('setSearch', value);
    },
  },
};
</script>

<style></style>

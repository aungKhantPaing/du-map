<template>
  <router-view></router-view>
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store';

export default {
  name: 'App',
  store,
};
</script>

<style lang="scss" scoped></style>

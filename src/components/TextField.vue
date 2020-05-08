<template>
  <input
    v-show="show"
    @input="({ target }) => onInput(target.value)"
    :value.sync="value"
    type="text"
    id="input"
    name="search"
    placeholder="Search"
  />
</template>

<script>
export default {
  props: {
    placeHolder: {
      type: String,
      default: '',
    },
    focus: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onInput(value) {
      this.$emit('input', value);
    },
  },
  watch: {
    show: () => {
      setTimeout(() => document.getElementById('input').focus(), 0);
    },
  },
};
</script>

<style>
#input {
  padding-left: 10px;
  height: 83%;
  width: 100%;
  color: black;
  background-color: white;
  border-radius: 8px;
}
#input:focus {
  outline: none;
}
</style>

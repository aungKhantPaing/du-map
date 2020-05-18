<template>
  <input
    v-show="show"
    @input="({ target }) => $emit('input', target.value)"
    @blur="$emit('blur')"
    :value.sync="value"
    :placeholder="placeHolder"
    type="text"
    id="input"
  />
</template>

<script>
export default {
  props: {
    placeHolder: {
      type: String,
      default: '',
    },
    autofocus: {
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
  watch: {
    show: function() {
      if (this.autofocus) setTimeout(() => document.getElementById('input').focus(), 0);
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

<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card color="red" class="elevation-12">
            <v-card-title style="color: white;">
              Connection Required!
            </v-card-title>
            <v-card-text style="color: white;">
              Try checking the network cables, modem, and router
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="onClick()" outlined color="white">Refresh</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  methods: {
    onClick() {
      this.$emit('reload');
    },
  },
};
</script>

<style lang="scss" scoped></style>

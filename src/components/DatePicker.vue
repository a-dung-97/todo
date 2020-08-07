<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="dateRangeText"
        :label="label"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker v-model="dateLocal" @input="menu = false"></v-date-picker>
  </v-menu>
</template>
<script>
export default {
  props: ["value", "label"],
  data: () => ({
    menu: false,
    dateLocal: null,
  }),
  watch: {
    dateLocal(val) {
      this.$emit("update:value", val);
    },
  },
  computed: {
    dateRangeText() {
      return new Date(this.value).toLocaleDateString("en-GB");
    },
  },
  mounted() {
    this.dateLocal = this.value;
  },
};
</script>

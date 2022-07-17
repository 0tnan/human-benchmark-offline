<template>
  <div class="Game">
    <grid-component />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GridComponent from "@/components/GridComponent.vue";

export default Vue.extend({
  components: {
    GridComponent,
  },
});
</script>

<style lang="scss">
.Game {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>

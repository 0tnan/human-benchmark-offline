<template>
  <div class="SequenceMemory">
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
.SequenceMemory {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>

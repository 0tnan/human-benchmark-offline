<template>
  <button
    @click="sendIndex()"
    class="Cell"
    :style="style"
    :disabled="!allowTouch"
  ></button>
</template>

<script lang="ts">
import Vue from "vue";

interface Dimension {
  height: string;
  width: string;
}

export default Vue.extend({
  name: "CellComponent",
  props: {
    col: {
      type: Number,
      required: true,
    },
    row: {
      type: Number,
      required: true,
    },
    gridWidth: {
      type: Number,
      default: 0,
    },
    allowTouch: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  computed: {
    calcWidth(): number {
      return Math.floor(this.gridWidth / this.col);
    },
    calcHeight(): number {
      return this.calcWidth;
    },
    style(): Dimension {
      return {
        height: `calc(${this.calcHeight}px - 0.25rem)`,
        width: `calc(${this.calcWidth}px - 0.25rem)`,
      };
    },
  },
  methods: {
    sendIndex(): void {
      this.$emit("child-index", this.index);
    },
  },
});
</script>

<style lang="scss" scoped>
.Cell {
  background-color: $color-primary;
  margin: 0 0.25rem 0.25rem 0;
  border-radius: 0.5rem;
  transition: all 0.5s ease-out;
  opacity: 0;

  &--show {
    opacity: 1;
  }

  &--glow {
    background-color: $white;
    border: 0.1rem solid $color-primary;
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>

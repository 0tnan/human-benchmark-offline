<template>
  <div class="GameSelection">
    <h1 class="GameSelection-title">Choose a game</h1>
    <div class="GameSelection-content">
      <ul class="GameSelection-container">
        <li
          v-for="(game, index) in gameDataObject"
          :key="index"
          class="GameSelection-route"
        >
          <router-link :to="game.route" tag="button">{{
            game.name
          }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import gameData from "@/data/gamelist.json";

export default Vue.extend({
  name: "GameSelectionView",
  data() {
    return {
      gameDataObject: null,
    };
  },
  mounted() {
    this.gameDataObject = gameData.games;
  },
});
</script>

<style lang="scss" scoped>
.GameSelection {
  $block: &;

  &-title {
    font-size: 4rem;
    text-align: center;
  }

  &-content {
    margin-top: 50%;
  }

  &-container {
    max-height: 20rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    font-size: $l;
    overflow: auto;
  }

  &-route {
    border: 1px solid;
    padding: 1rem;
    border-radius: 5rem;
    margin-bottom: 1rem;

    &:nth-child(3n + 1) {
      border-color: $color-primary;
    }

    &:nth-child(3n + 2) {
      border-color: $color-tertiary;
    }

    &:nth-child(3n + 3) {
      border-color: $color-secondary;
    }
  }
}
</style>

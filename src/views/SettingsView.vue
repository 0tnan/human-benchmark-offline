<template>
  <div class="Settings">
    <ul class="Settings-list">
      <li class="Settings-item">
        <label for="cb1">Dark Mode</label>
        <input
          class="Settings-toggle Settings-toggle--light"
          id="cb1"
          type="checkbox"
          v-model="value"
          @change="handleChange"
        />
        <label class="Settings-toggle--btn" for="cb1"></label>
      </li>
      <li class="Settings-item Settings-item--score">
        <label>HighScore</label>
        <ul class="Settings-scoreContainer">
          <li
            v-for="(score, label) in getHighscore"
            :key="score"
            class="Settings-scoreItem"
            :class="getDarkMode ? 'Settings-scoreItem--dark' : ''"
          >
            <label>{{ label | formatScore }}</label>
            <label>{{ score }}</label>
          </li>
        </ul>
      </li>
      <li class="Settings-item">
        <label>Pseudo</label>
        <input
          class="Settings-pseudo"
          :class="getDarkMode ? 'Settings-pseudo--dark' : ''"
          type="text"
          v-model="pseudo"
          @change="handleChange"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import Vue from "vue";
import { mapGetters } from "vuex";
import "@/filters";

export default Vue.extend({
  computed: {
    ...mapGetters(["getDarkMode", "getHighscore", "getPseudo"]),
  },
  data() {
    return {
      value: false,
      pseudo: "",
      scoreLabels: [] as string[],
    };
  },
  mounted() {
    this.value = this.getDarkMode;
    this.pseudo = this.getPseudo;
    let scores = Object.entries(this.getHighscore);
    scores.forEach((score) => {
      this.scoreLabels.push(score[0]);
    });
  },
  methods: {
    handleChange(): void {
      store.commit("setMode", this.value);
      store.commit("setPseudo", this.pseudo);
    },
  },
});
</script>

<style lang="scss" scoped>
.Settings {
  display: flex;
  flex-direction: column;
  font-size: $xl;

  &-toggle {
    @include Toggle;

    & + &--btn {
      width: 6rem;
      height: 3rem;
    }

    &--light + &--btn {
      background: $grey;
    }
  }

  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;

    &--score {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  &-pseudo {
    font-family: $font-primary;
    font-size: $xl;
    background: none;
    border: none;
    outline: none;
    text-align: right;
    text-overflow: ellipsis;
    max-width: 15rem;
    user-select: text;
    border-bottom: 0.1rem solid $grey;

    &:active,
    &:focus {
      outline: none;
    }

    &--dark {
      color: $white;
    }
  }

  &-score {
    &Container {
      padding-left: 1.5rem;
      margin-top: 1.5rem;
      width: 100%;
      box-sizing: border-box;
    }

    &Item {
      width: 100%;
      position: relative;
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.5rem;

      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: -1.5rem;
        transform: translateY(-50%);
        height: 1rem;
        width: 1rem;
        background: $black;
        border-radius: 50%;
      }

      &--dark {
        &::before {
          background: $white;
        }
      }
    }
  }
}
</style>

<template>
  <div
    id="app"
    class="App"
    :class="[
      getDarkMode ? 'App--dark' : '',
      withoutPadding ? 'App--noPadding' : '',
    ]"
  >
    <transition mode="out-in" name="fade">
      <router-view @remove-padding="removePadding" />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store";
import { mapGetters } from "vuex";
import { App } from "@capacitor/app";

export default Vue.extend({
  computed: {
    ...mapGetters(["getDarkMode"]),
    currentRoute() {
      return this.$route.name;
    },
  },
  data() {
    return {
      withoutPadding: false,
    };
  },
  methods: {
    removePadding() {
      this.withoutPadding = true;
    },
  },
  beforeMount() {
    App.addListener("backButton", () => {
      if (this.currentRoute === "home") {
        App.exitApp();
      } else if (
        this.currentRoute === "game-selection" ||
        this.currentRoute === "settings" ||
        this.currentRoute === "about"
      ) {
        this.$router.push({ name: "home" });
      } else {
        this.$router.push({ name: "game-selection" });
      }
    });
    let state = localStorage.getItem("human-benchmark-state");
    if (state) {
      let stateObject = JSON.parse(state);
      store.commit("setMode", stateObject.isDarkMode);
      let scores = Object.entries(stateObject.highscore);
      scores.forEach((score) => {
        store.commit("setScore", { type: score[0], value: score[1] });
      });
      store.commit("setPseudo", stateObject.pseudo);
    }
  },
  watch: {
    $route() {
      this.withoutPadding = false;
      store.commit("setDictionary", []);
    },
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/main";

.App {
  box-sizing: border-box;
  height: 100%;
  font-family: $font-primary;
  padding: 2.5rem;
  color: $black;
  transition: all 0.5s ease-in-out;

  &--dark {
    background-color: $darkMode;
    color: $white;
  }

  &--noPadding {
    padding: 0;
  }
}
</style>

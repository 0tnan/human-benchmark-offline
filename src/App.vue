<template>
  <div id="app" class="App" :class="getDarkMode ? 'App--dark' : ''">
    <transition mode="out-in" name="fade">
      <router-view />
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
  beforeMount() {
    App.addListener("backButton", () => {
      if (this.currentRoute === "home") {
        App.exitApp();
      }
      window.history.back();
    });
    let state = localStorage.getItem("human-benchmark-state");
    if (state) {
      let stateObject = JSON.parse(state);
      store.commit("setMode", stateObject.isDarkMode);
      store.commit("setScore", stateObject.highscore);
      store.commit("setPseudo", stateObject.pseudo);
    }
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
}
</style>

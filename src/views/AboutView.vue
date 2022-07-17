<template>
  <div class="About">
    <h1>Copyright - Nanto 2022</h1>
    <div class="About-icons">
      <a
        href="https://github.com/Andriamanantoanina"
        class="About-iconContainer"
        target="blank"
      >
        <GithubIcon
          class="About-icon"
          :class="getDarkMode ? 'About-icon--dark' : ''"
          viewbox="0 0 50 50"
        />
      </a>
      <a
        href="https://rakotondranaly.fr"
        class="About-iconContainer"
        target="blank"
      >
        <GlobeIcon
          class="About-icon"
          :class="getDarkMode ? 'About-icon--dark' : ''"
        />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GithubIcon from "@/assets/img/github.svg";
import GlobeIcon from "@/assets/img/globe.svg";
import { mapGetters } from "vuex";

export default Vue.extend({
  components: {
    GithubIcon,
    GlobeIcon,
  },
  computed: {
    ...mapGetters(["getDarkMode"]),
  },
});
</script>

<style lang="scss" scoped>
.About {
  font-size: $xl;

  &-icons {
    display: flex;
    margin-top: 5vh;
    margin-left: 5vw;
  }

  &-icon {
    height: 5rem;
    width: 5rem;
    transform: scale(2);

    &Container {
      & + & {
        margin-left: 1.5rem;
      }
    }

    &--dark {
      fill: $white;
    }
  }
}
</style>

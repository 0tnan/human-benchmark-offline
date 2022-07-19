<template>
  <div class="Home" :class="{ 'Home--mounted': isMounted }">
    <h1 class="Home-title">Human Benchmark</h1>
    <div class="Home-content">
      <ul class="Home-container">
        <li class="Home-route">
          <router-link to="/game-selection" tag="button">New Game</router-link>
        </li>
        <li class="Home-route">
          <router-link to="/settings" tag="button">Settings</router-link>
        </li>
        <li class="Home-route">
          <router-link to="/about" tag="button">About</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "HomeView",
  data() {
    return {
      isMounted: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.isMounted = true;
    }, 500);
  },
});
</script>

<style lang="scss" scoped>
.Home {
  $block: &;

  height: 100%;

  &--mounted {
    #{$block}-route {
      transform: translateY(0) !important;
    }

    #{$block}-title {
      opacity: 1 !important;
    }
  }

  &-title {
    display: flex;
    flex-direction: column;
    font-size: $xxl;
    transition: all 0.5s;
    opacity: 0;
  }

  &-content {
    height: 100%;
    margin-top: 3vh;
    color: $white;
  }

  &-container {
    display: flex;
    height: 100%;
    flex-direction: column;
  }

  &-route {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;

    &:first-child,
    &:nth-child(2),
    &:last-child {
      transform: translateY(100rem);
    }

    &:first-child {
      transition: all 0.5s ease-out;
    }

    &:first-child button {
      background: $color-primary;
    }

    &:nth-child(2) {
      transition: all 0.5s 0.5s ease-out;
    }

    &:nth-child(2) button {
      background: $color-tertiary;
    }

    &:last-child {
      transition: all 0.5s 1s ease-out;
    }

    &:last-child button {
      background: $color-secondary;
    }

    .router {
      &-link {
        &-active {
          text-decoration: none;
        }

        &-exact {
          &-active {
            text-decoration: none;
          }
        }
      }
    }

    button {
      width: 100%;
      border-radius: 1rem;
      padding: 10vh 0;
      transition: all 0.2s ease-in;
      font-size: 2.5rem;

      &:active {
        transform: scale(0.98);
      }
    }
  }
}
</style>

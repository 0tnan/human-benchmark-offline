<template>
  <div class="NumberMemory">
    <transition name="fade" appear>
      <div v-if="!isGuessing" class="NumberMemory-container">
        <div class="NumberMemory-number">{{ currentNumber }}</div>
        <transition name="fade">
          <div
            v-if="!hideLoader"
            class="NumberMemory-loader"
            :style="getLoaderStyle"
            :class="getDarkMode ? 'NumberMemory-loader--dark' : ''"
          ></div>
        </transition>
      </div>
      <div class="NumberMemory-container" v-else-if="isGuessing && !error">
        <div class="NumberMemory-guessTitle">What was the number ?</div>
        <div class="NumberMemory-guessValidator">
          <input
            class="NumberMemory-guessNumber"
            :class="getDarkMode ? 'NumberMemory-guessNumber--dark' : ''"
            type="number"
            v-model="enteredValue"
          />
          <button
            class="NumberMemory-guessButton"
            :class="getDarkMode ? 'NumberMemory-guessButton--dark' : ''"
            @click="handleClick"
          >
            Validate
          </button>
        </div>
      </div>
      <div class="NumberMemory-container NumberMemory-container--retry" v-else>
        <div class="NumberMemory-retryTitle">Try Again ?</div>
        <div class="NumberMemory-buttonsContainer">
          <button
            class="NumberMemory-guessButton"
            :class="getDarkMode ? 'NumberMemory-guessButton--dark' : ''"
            @click.prevent="retry"
          >
            Retry
          </button>
          <router-link
            to="/game-selection"
            tag="button"
            class="NumberMemory-guessButton NumberMemory-guessButton--noBg"
            :class="getDarkMode ? 'NumberMemory-guessButton--dark' : ''"
            >Back</router-link
          >
          <div class="NumberMemory-score">Personal Best : {{ score }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import Vue from "vue";
import { mapGetters } from "vuex";

const INCREMENT_DURATION = 500;
const DURATION = 3000;
const MIN = 1;
const MAX = 10;

interface Animation {
  animation: string;
  animationFillMode: string;
}

export default Vue.extend({
  data() {
    return {
      currentNumber: 0,
      isGuessing: false,
      duration: DURATION,
      currentMin: MIN,
      currentMax: MAX,
      loaderStyle: {} as Animation,
      hideLoader: false,
      enteredValue: null,
      success: false,
      error: false,
      score: 0,
    };
  },
  mounted() {
    this.play();
  },
  computed: {
    ...mapGetters(["getDarkMode"]),
    getLoaderStyle(): Animation {
      return {
        animation: `invisible ${this.duration / 1000}s`,
        animationFillMode: "forwards",
      };
    },
  },
  methods: {
    generateRandomNumber(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min) + min);
    },
    play(): void {
      this.currentNumber = this.generateRandomNumber(
        this.currentMin,
        this.currentMax
      );
      setTimeout(() => {
        this.hideLoader = true;
        this.isGuessing = true;
      }, this.duration);
    },
    increaseDifficulty(): void {
      this.currentMin = this.currentMin * MAX;
      this.currentMax = this.currentMax * MAX;
    },
    handleClick(): void {
      if (!this.enteredValue || this.enteredValue === "") {
        return;
      }
      if (this.enteredValue == this.currentNumber) {
        this.success = true;
        this.reset(this.success);
      } else {
        this.success = false;
        this.error = true;
      }
    },
    retry(): void {
      this.reset(this.success);
    },
    reset(state: boolean): void {
      this.enteredValue = null;
      this.isGuessing = false;
      this.hideLoader = false;
      if (state) {
        this.score++;
        store.commit("setScore", {
          type: "numberMemoryScore",
          value: this.score,
        });
        this.increaseDifficulty();
        this.duration = this.duration + INCREMENT_DURATION;
        this.play();
      } else {
        this.isGuessing = false;
        this.error = false;
        this.success = false;
        this.duration = DURATION;
        this.currentMin = MIN;
        this.currentMax = MAX;
        this.play();
      }
    },
  },
});
</script>

<style lang="scss">
.NumberMemory {
  height: 100%;
  width: 100%;

  &-container {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    position: relative;

    &--retry {
      flex-direction: column;
      justify-content: center;
    }
  }

  &-number,
  &-guessTitle {
    position: absolute;
    top: 20%;
    font-size: 5rem;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  &-loader {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translateX(-50%);
    height: 1rem;
    background: $black;
    border: 0.1rem solid $black;
    border-radius: 5rem;

    &--dark {
      background: $white;
      border-color: $white;
    }

    &--hide {
      opacity: 0;
    }
  }

  &-guess {
    &Validator {
      position: absolute;
      display: flex;
      flex-direction: column;
    }

    &Number {
      @include input;
    }

    &Button {
      @include button;
    }
  }

  &-retry {
    &Title {
      font-size: 5rem;
      margin-bottom: 2.5rem;
    }
  }

  &-buttons {
    &Container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  &-score {
    margin-top: 4rem;
    font-size: $xl;
  }
}
</style>

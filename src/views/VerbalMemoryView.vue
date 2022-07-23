<template>
  <div v-if="mounted" class="VerbalMemory">
    <div v-if="hasLives" class="verbalMemory-gameOn">
      <div class="VerbalMemory-topContent">
        <div class="VerbalMemory-lives">Lives | {{ currentLives }}</div>
        <div class="VerbalMemory-score">Score | {{ score }}</div>
      </div>
      <div class="VerbalMemory-word">{{ currentWord }}</div>
      <div class="VerbalMemory-buttons">
        <button
          class="VerbalMemory-button"
          :class="getDarkMode ? 'VerbalMemory-button--dark' : ''"
          @click="makeChoice('seen')"
        >
          Seen
        </button>
        <button
          class="VerbalMemory-button"
          :class="getDarkMode ? 'VerbalMemory-button--dark' : ''"
          @click="makeChoice('new')"
        >
          New
        </button>
      </div>
    </div>
    <div v-else class="VerbalMemory-gameOver">
      <span>{{ score }} words</span>
      <button
        class="VerbalMemory-button"
        :class="getDarkMode ? 'VerbalMemory-button--dark' : ''"
        @click="reset"
      >
        Try Again
      </button>
    </div>
  </div>
  <div v-else class="VerbalMemory">
    <img v-if="getDarkMode" src="@/assets/img/loading.png" />
    <img v-else src="@/assets/img/loading-dark.png" />
    <p>Loading...</p>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import Vue from "vue";
import { mapGetters } from "vuex";

const LIVES = 3;
const SEEN = "seen";
const MIN_ITERATION_TO_LOOK_IN_PAST_WORDS = 5;

export default Vue.extend({
  data() {
    return {
      dictionary: [],
      maxNumber: 0,
      currentLives: LIVES,
      score: 0,
      currentWord: "",
      pastWords: [] as string[],
      mounted: false,
      fetch: 0,
    };
  },
  computed: {
    ...mapGetters(["getDarkMode", "getDictionary"]),
    hasLives(): boolean {
      return this.currentLives > 0 ? true : false;
    },
  },
  async mounted() {
    try {
      await store.dispatch("fetchDictionary").then(() => {
        this.mounted = true;
        this.dictionary = this.getDictionary;
        this.maxNumber = this.getDictionary.length;
        this.generateWord();
      });
    } catch {
      console.error("an error occured");
    }
  },
  methods: {
    generateRandomNumber(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min) + min);
    },
    headsOrTails(): number {
      return Math.random();
    },
    makeChoice(value: string): void {
      if (value === SEEN) {
        if (this.pastWords.indexOf(this.currentWord) > -1) {
          this.score++;
          this.continue();
        } else {
          this.currentLives--;
          this.continue();
        }
      } else {
        if (this.pastWords.indexOf(this.currentWord) === -1) {
          this.score++;
          this.pastWords.push(this.currentWord);
          this.continue();
        } else {
          this.currentLives--;
          this.continue();
        }
      }
    },
    continue(): void {
      const headsOrTails = this.headsOrTails();
      if (
        headsOrTails >= 0.5 &&
        this.pastWords.length > MIN_ITERATION_TO_LOOK_IN_PAST_WORDS
      ) {
        const rand = this.generateRandomNumber(0, this.pastWords.length);
        this.currentWord = this.pastWords[rand];
      } else {
        this.generateWord();
      }
    },
    generateWord(): void {
      const rand = this.generateRandomNumber(0, this.maxNumber);
      this.currentWord = this.dictionary[rand][0];
    },
    reset(): void {
      this.score = 0;
      this.pastWords = [];
      this.generateWord();
      this.currentLives = LIVES;
    },
  },
  watch: {
    currentLives(val) {
      if (val === 0) {
        store.commit("setScore", {
          type: "verbalMemoryScore",
          value: this.score,
        });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.VerbalMemory {
  $block: &;
  font-size: $xxl;
  margin-top: 35vh;
  position: relative;

  &-topContent,
  &-buttons {
    display: flex;
    justify-content: space-evenly;
  }

  &-word {
    text-align: center;
    margin: 4.5vh 0 2.5vh;
  }

  &-buttons {
    margin: 0 5vw;
  }

  &-button {
    @include button;

    width: calc(100% - 45vw);
  }

  img,
  p {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  p {
    margin-top: 10vh;
  }

  &-game {
    &Over {
      display: flex;
      align-items: center;
      flex-direction: column;
    }
  }
}
</style>

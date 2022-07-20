<template>
  <div class="ReactionTime" @click.self="startGame">
    <ThunderIcon
      @click="startGame"
      v-if="!gameStarted"
      class="ReactionTime-icon"
      :class="getDarkMode ? 'ReactionTime-icon--dark' : ''"
    />
    <transition name="fade" appear>
      <div
        @click="startGame"
        v-if="showTitle && !gameStarted"
        class="ReactionTime-title"
      >
        Reaction Time Test
      </div>
    </transition>
    <transition name="fade" appear>
      <div
        @click="startGame"
        v-if="showInfo && !gameStarted"
        class="ReactionTime-info"
      >
        <p>When the red box turns green, touch as quickly as you can.</p>
        <p>Touch anywhere to start</p>
      </div>
    </transition>
    <transition>
      <div
        @click="handleForbiddenClick"
        v-if="gameStarted && !showGreen && !showCurrentStat && !forbiddenClick"
        class="ReactionTime-game ReactionTime-game--red"
      >
        <p>Wait for green...</p>
      </div>
      <div
        @click="resume"
        v-if="gameStarted && !showGreen && !showCurrentStat && forbiddenClick"
        class="ReactionTime-game ReactionTime-game--red ReactionTime-game--forbidden"
      >
        <p>You touched too soon <br />Touch anywhere to retry</p>
      </div>
      <div
        v-else-if="
          gameStarted && showGreen && !showCurrentStat && !forbiddenClick
        "
        class="ReactionTime-game ReactionTime-game--green"
        @click="handleClick"
      >
        <p>TOUCH !</p>
      </div>
      <div
        v-else-if="
          gameStarted && showGreen && showCurrentStat && !forbiddenClick
        "
        class="ReactionTime-game ReactionTime-game--green"
        @click="continueGame"
      >
        <p v-if="gameAllowed">
          {{ getTimeForThisTurn }}ms <br />Touch anywhere to continue
        </p>
        <div class="ReactionTime-content" v-else>
          <ThunderIcon
            class="ReactionTime-icon ReactionTime-icon--finished ReactionTime-icon--dark"
          />
          <p>
            Your score : {{ getAverageScore }}ms<br />Touch anywhere to retry
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ThunderIcon from "@/assets/img/thunder.svg";
import { mapGetters } from "vuex";
import store from "@/store";

const MIN_TIME = 3000;
const MAX_TIME = 6000;
const TURNS = 5;

export default Vue.extend({
  components: {
    ThunderIcon,
  },
  data() {
    return {
      showTitle: false,
      showInfo: false,
      gameStarted: false,
      timeForGreen: 0,
      showGreen: false,
      startTime: 0,
      endTime: 0,
      timeForThisTurn: 0,
      turns: 0,
      times: [] as number[],
      showCurrentStat: false,
      forbiddenClick: false,
      counter: 0,
    };
  },
  computed: {
    ...mapGetters(["getDarkMode"]),
    getTimeForThisTurn(): number {
      if (this.times) {
        return Math.floor(this.times[this.turns - 1]);
      }
      return 0;
    },
    gameAllowed(): boolean {
      return this.turns < TURNS;
    },
    getAverageScore(): number {
      let average = this.times.reduce(
        (avg, value, index, { length }) => avg + value / length,
        0
      );
      return Math.floor(average);
    },
  },
  mounted() {
    setTimeout(() => {
      this.showTitle = true;
    }, 500);
    setTimeout(() => {
      this.showInfo = true;
    }, 1000);
  },
  methods: {
    startGame(): void {
      this.$emit("remove-padding");
      this.gameStarted = true;
      this.timeForGreen = this.generateRandomNumber(MIN_TIME, MAX_TIME);
      this.counter = setTimeout(() => {
        this.showGreen = true;
        this.startTime = performance.now();
        clearTimeout(this.counter);
      }, this.timeForGreen);
    },
    generateRandomNumber(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min) + min);
    },
    handleClick(): void {
      this.endTime = performance.now();
      this.turns++;
      this.timeForThisTurn = this.endTime - this.startTime;
      this.times.push(this.timeForThisTurn);
      if (this.turns === TURNS) {
        store.commit("setScore", {
          type: "reactionTimeScore",
          value: `${this.getAverageScore}ms`,
        });
      }
      this.startTime = 0;
      this.endTime = 0;
      this.timeForGreen = 0;
      this.timeForThisTurn = 0;
      this.showCurrentStat = true;
    },
    continueGame(): void {
      this.showGreen = false;
      this.showCurrentStat = false;
      if (this.turns === TURNS) {
        this.times = [];
        this.turns = 0;
      }
      this.startGame();
    },
    handleForbiddenClick(): void {
      this.forbiddenClick = true;
      clearTimeout(this.counter);
    },
    resume() {
      this.forbiddenClick = false;
      this.startTime = 0;
      this.endTime = 0;
      this.timeForGreen = 0;
      this.timeForThisTurn = 0;
      this.continueGame();
    },
  },
});
</script>

<style lang="scss" scoped>
.ReactionTime {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  min-width: 100%;
  position: relative;

  &-icon {
    margin-top: 30vh;
    transform: scale(5);
    fill: $black;
    animation: blink 2s infinite;

    path {
      stroke: $black;
    }

    &--dark {
      fill: $white;

      path {
        stroke: $white;
      }
    }

    &--finished {
      margin-top: 0;
      margin-left: 50%;
      margin-bottom: 10vh;
      transform: translateX(-50%) scale(5);
      margin-top: 2vh;
    }
  }

  &-title {
    margin-top: 7vh;
    font-size: $xxl;
  }

  &-info {
    margin-top: 2vh;
    text-align: center;
    font-size: $xxl;

    p + p {
      margin-top: 1.5vh;
    }
  }

  &-game {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 5vh;

    &--red {
      background: $red;
    }

    &--green {
      background: $green;
    }

    &--forbidden {
      z-index: 999;
    }

    p {
      text-align: center;
      font-size: $xxl;
      color: $white;
    }
  }

  &-content {
    display: flex;
    justify-content: center;
    flex-grow: 1;
    flex-direction: column;
    height: 100%;
    text-align: center;
    font-size: $xxl;
  }
}
</style>

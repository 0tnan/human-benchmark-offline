<template>
  <transition>
    <div v-if="!gameStarted && !gameEnded" class="AimTrainer" ref="AimTrainer">
      <TargetIcon
        class="AimTrainer-icon AimTrainer-icon--firstIcon"
        :class="getDarkMode ? 'AimTrainer-icon--dark' : ''"
        @click="startGame"
      />
      <p>Hit 30 targets as quickly as you can</p>
      <p>Touch the target above to begin</p>
    </div>
    <div v-else-if="gameStarted && !gameEnded">
      <TargetIcon
        class="AimTrainer-icon AimTrainer-icon--target"
        :class="getDarkMode ? 'AimTrainer-icon--dark' : ''"
        @click="handleClick"
        :style="getPosition"
      />
    </div>
    <div v-else class="AimTrainer AimTrainer--results">
      <TargetIcon
        class="AimTrainer-icon AimTrainer-icon--firstIcon"
        :class="getDarkMode ? 'AimTrainer-icon--dark' : ''"
      />
      <p>YOUR AVERAGE TIME PER TARGET IS {{ this.averageScore }}ms</p>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
import TargetIcon from "@/assets/img/target.svg";
import { mapGetters } from "vuex";
import store from "@/store";

const TARGETS = 30;

interface Position {
  top: string;
  left: string;
}

export default Vue.extend({
  components: {
    TargetIcon,
  },
  computed: {
    ...mapGetters(["getDarkMode"]),
    getPosition(): Position {
      return { top: `${this.top}px`, left: `${this.left}px` };
    },
  },
  data() {
    return {
      gameStarted: false,
      top: 0,
      left: 0,
      viewportHeight: 0,
      viewportWidth: 0,
      startTime: 0,
      endTime: 0,
      targetsLeft: TARGETS,
      gameEnded: false,
      averageScore: 0,
    };
  },
  mounted() {
    this.$emit("remove-padding");
    setTimeout(() => {
      this.viewportHeight = this.$refs.AimTrainer.clientHeight;
      this.viewportWidth = this.$refs.AimTrainer.clientWidth;
    }, 500);
  },
  methods: {
    startGame(): void {
      this.gameStarted = true;
      this.top = this.generateRandomNumber(0, this.viewportHeight - 50);
      this.left = this.generateRandomNumber(0, this.viewportWidth - 50);
      this.startTime = performance.now();
    },
    handleClick() {
      this.targetsLeft--;
      this.top = this.generateRandomNumber(0, this.viewportHeight - 50);
      this.left = this.generateRandomNumber(0, this.viewportWidth - 50);
      if (this.targetsLeft === 0) {
        this.gameEnded = true;
        this.endTime = performance.now();
        this.averageScore = Math.floor(
          (this.endTime - this.startTime) / TARGETS
        );
        store.commit("setScore", {
          type: "aimTrainerScore",
          value: `${this.averageScore}ms`,
        });
      }
    },
    generateRandomNumber(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min) + min);
    },
  },
});
</script>

<style lang="scss" scoped>
.AimTrainer {
  $block: &;

  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: $xxl;
  position: relative;
  height: 100%;

  &-icon {
    height: 50px;
    width: 50px;

    &--dark {
      path {
        fill: $white;
      }
    }

    &--firstIcon {
      margin-top: 25vh;
      height: 20vh;
      width: 50vw;
      animation: blink 2s infinite;
    }

    &--target {
      position: absolute;
    }
  }

  p {
    text-align: center;
    margin: 2.5rem 2.5rem;
  }
}
</style>

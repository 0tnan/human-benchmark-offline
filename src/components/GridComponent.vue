<template>
  <ul class="Grid" ref="Grid">
    <li class="Grid-cell" v-for="cell in gridVisibility" :key="cell.index">
      <cell-component
        :class="[
          cell.visible ? 'Cell--show' : '',
          cell.glow ? 'Cell--glow' : '',
        ]"
        :index="cell.index"
        :col="col"
        :row="row"
        :grid-width="gridWidth"
        :allow-touch="allowTouch"
        @child-index="handleClick"
      />
    </li>
    <transition name="fade" appear>
      <span
        :key="currentCountdown"
        v-if="startGame && currentCountdown !== 0"
        class="Grid-counter"
        >{{ currentCountdown }}
      </span>
      <span
        :key="currentCountdown"
        v-if="getCurrentScore > 0"
        class="Grid-score"
        >{{ getCurrentScore }}
      </span>
    </transition>
    <transition name="fade">
      <CrossIcon v-if="error" class="Grid-icon" />
    </transition>
    <transition name="fade">
      <OkayIcon
        v-if="success"
        class="Grid-icon"
        width="60"
        height="60"
        viewBox="0 0 60 60"
      />
    </transition>
  </ul>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store";
import { mapGetters } from "vuex";
import CellComponent from "@/components/CellComponent.vue";
import CrossIcon from "@/assets/img/cross.svg";
import OkayIcon from "@/assets/img/okay.svg";

interface Cell {
  index: number;
  visible: boolean;
  glow: boolean;
}

const CELL_SHOW_DELAY = 66;
const CELL_GLOW_DELAY = 1000;
const DEFAULT_COLUMS_NUMBER = 4;
const DEFAULT_ROWS_NUMBER = 4;
const COUNTDOWN = [3, 2, 1, 0];
const INITIAL_SEQUENCE_COUNT = 3;

export default Vue.extend({
  components: {
    CellComponent,
    CrossIcon,
    OkayIcon,
  },
  data() {
    return {
      col: DEFAULT_COLUMS_NUMBER,
      row: DEFAULT_ROWS_NUMBER,
      gridWidth: 0,
      gridVisibility: [] as Cell[],
      loop: 0,
      startGame: false,
      currentCountdown: COUNTDOWN[0],
      allowTouch: false,
      gameSequence: [] as number[],
      currentSequenceLength: 0,
      currentCursor: 0,
      currentCursorIteration: 0,
      previousGlowed: -1,
      error: false,
      success: false,
      clickCount: 0,
      currentScore: 0,
    };
  },
  mounted() {
    this.gridWidth = this.$refs.Grid.clientWidth;
    this.generateCell(this.getCellsCount);
    this.generateSequence();
    this.currentCursor = this.gameSequence[0];
  },
  computed: {
    ...mapGetters(["getHighscore"]),
    getCellsCount(): number {
      return this.col * this.row;
    },
    getCurrentScore(): number {
      return this.currentScore;
    },
  },
  methods: {
    fill(cell: Cell): void {
      this.loop = setTimeout(() => {
        this.gridVisibility[cell.index].visible = true;
        if (cell.index + 1 === this.getCellsCount) {
          this.startGame = true;
        }
      }, CELL_SHOW_DELAY * cell.index);
    },
    generateCell(value: number): void {
      for (let i = 0; i < value; i++) {
        this.gridVisibility.push({ index: i, visible: false, glow: false });
      }
      this.gridVisibility.forEach((cell) => {
        this.fill(cell);
      });
    },
    generateSequence(): void {
      while (this.gameSequence.length < INITIAL_SEQUENCE_COUNT) {
        let random = this.generateRandomNumber();
        if (this.gameSequence.indexOf(random) === -1) {
          this.gameSequence.push(random);
        }
      }
    },
    generateRandomNumber(): number {
      return Math.floor(Math.random() * this.getCellsCount - 1) + 1;
    },
    startCountdown(index: number): void {
      setTimeout(() => {
        this.currentCountdown = COUNTDOWN[index];
      }, 1000 * index);
    },
    handleClick(index: number): void {
      this.clickCount++;
      if (index === this.currentCursor) {
        if (this.clickCount === this.gameSequence.length) {
          this.gridVisibility[index].glow = true;
          setTimeout(() => {
            this.gridVisibility.forEach((cell) => {
              cell.glow = false;
            });
          }, CELL_GLOW_DELAY / 2);
          setTimeout(() => {
            this.gridVisibility.forEach((cell) => {
              cell.glow = false;
            });
          }, CELL_GLOW_DELAY);
          this.currentScore++;
          store.commit("setScore", this.currentScore);
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, CELL_GLOW_DELAY / 2);
          this.increaseDifficulty();
        } else if (this.clickCount < this.gameSequence.length) {
          this.gridVisibility[index].glow = true;
          setTimeout(() => {
            this.gridVisibility[index].glow = false;
          }, CELL_GLOW_DELAY / 2);
          this.getNext();
        }
      } else {
        this.error = true;
        setTimeout(() => {
          this.error = false;
        }, CELL_GLOW_DELAY / 2);
        this.resetAll();
      }
    },
    getNext(): void {
      this.currentCursorIteration++;
      this.currentCursor = this.gameSequence[this.currentCursorIteration];
    },
    glowCell(index: number, iteration: number): void {
      setTimeout(() => {
        this.currentSequenceLength++;
        this.gridVisibility[index].glow = true;
      }, CELL_GLOW_DELAY / 2 + iteration * CELL_GLOW_DELAY);
      setTimeout(() => {
        if (this.previousGlowed !== -1) {
          this.gridVisibility[this.previousGlowed].glow = false;
        }
        this.previousGlowed = index;
      }, CELL_GLOW_DELAY * iteration);
    },
    resetAll(): void {
      this.currentScore = 0;
      this.clickCount = 0;
      this.gridVisibility.forEach((cell) => {
        cell.glow = false;
      });
      this.allowTouch = false;
      this.previousGlowed = -1;
      this.gameSequence = [];
      this.generateSequence();
      this.currentSequenceLength = 0;
      this.currentCursorIteration = 0;
      this.currentCursor = this.gameSequence[0];
      let iteration = 1;
      this.gameSequence.forEach((index) => {
        this.glowCell(index, iteration);
        iteration++;
      });
    },
    increaseDifficulty() {
      this.clickCount = 0;
      this.allowTouch = false;
      this.previousGlowed = -1;
      let newNumber = this.generateRandomNumber();
      this.gameSequence.push(newNumber);
      this.currentCursor = this.gameSequence[0];
      this.currentSequenceLength = 0;
      this.currentCursorIteration = 0;
      let iteration = 1;
      this.gameSequence.forEach((index) => {
        this.glowCell(index, iteration);
        iteration++;
      });
    },
  },
  watch: {
    getCellsCount(val: number) {
      this.gridVisibility = [];
      this.generateCell(val);
    },
    startGame() {
      for (let i = 1; i < COUNTDOWN.length; i++) {
        this.startCountdown(i);
      }
    },
    currentCountdown(val: number) {
      if (val === 0 && this.startGame) {
        let iteration = 1;
        this.gameSequence.forEach((index) => {
          this.glowCell(index, iteration);
          iteration++;
        });
        this.startGame = false;
      }
    },
    currentSequenceLength(val: number) {
      if (val === this.gameSequence.length) {
        setTimeout(() => {
          this.allowTouch = true;
          this.gridVisibility.forEach((cell) => {
            cell.glow = false;
          });
        }, CELL_GLOW_DELAY);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.Grid {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: auto;
  position: relative;

  &-counter {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    color: rgba(255, 255, 255, 0.8);
    font-size: 7.5rem;
  }

  &-score {
    position: absolute;
    top: -50%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 7.5rem;
  }

  &-icon {
    position: absolute;
    bottom: -25%;
    left: 50%;
    transform: translateX(-50%);
    height: 6rem;
    width: 6rem;
  }
}
</style>

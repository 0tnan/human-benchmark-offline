import Vue from "vue";
import Vuex from "vuex";
import { uuid } from "vue-uuid";

Vue.use(Vuex);

interface State {
  isDarkMode: boolean;
  highscore: Highscore;
  pseudo: string;
}

interface Highscore {
  sequenceMemoryScore: number;
  numberMemoryScore: number;
}

enum HighscoreLabels {
  sequenceMemoryScore = "sequenceMemoryScore",
  numberMemoryScore = "numberMemoryScore",
}

interface HighScorePayload {
  type: HighscoreLabels;
  value: number;
}

const UUID = uuid.v1();

export default new Vuex.Store({
  state() {
    return {
      isDarkMode: false,
      highscore: {
        sequenceMemoryScore: 0,
        numberMemoryScore: 0,
      } as Highscore,
      pseudo: UUID,
    };
  },
  getters: {
    getDarkMode(state: State) {
      return state.isDarkMode;
    },
    getHighscore(state: State) {
      return state.highscore;
    },
    getPseudo(state: State) {
      return state.pseudo;
    },
  },
  mutations: {
    setMode(state: State, value: boolean) {
      state.isDarkMode = value;
      localStorage.setItem("human-benchmark-state", JSON.stringify(state));
    },
    setScore(state: State, payload: HighScorePayload) {
      if (payload.value > state.highscore[payload.type]) {
        state.highscore[payload.type] = payload.value;
        localStorage.setItem("human-benchmark-state", JSON.stringify(state));
      }
    },
    setPseudo(state: State, value: string) {
      state.pseudo = value;
      localStorage.setItem("human-benchmark-state", JSON.stringify(state));
    },
  },
  actions: {},
  modules: {},
});

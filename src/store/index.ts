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
  reactionTimeScore: string;
}

enum HighscoreLabels {
  sequenceMemoryScore = "sequenceMemoryScore",
  numberMemoryScore = "numberMemoryScore",
  reactionTimeScore = "reactionTimeScore",
}

interface HighScorePayload {
  type: HighscoreLabels;
  value: number | string;
}

const UUID = uuid.v1();

export default new Vuex.Store({
  state() {
    return {
      isDarkMode: false,
      highscore: {
        sequenceMemoryScore: 0,
        numberMemoryScore: 0,
        reactionTimeScore: "",
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
      if (payload.type != HighscoreLabels.reactionTimeScore) {
        if (
          payload.value > state.highscore[payload.type] &&
          typeof payload.value === "number"
        ) {
          state.highscore[payload.type] = payload.value;
          localStorage.setItem("human-benchmark-state", JSON.stringify(state));
        }
      } else if (payload.type === HighscoreLabels.reactionTimeScore) {
        if (typeof payload.value === "string") {
          const currentScore = state.highscore[payload.type].replace("ms", "");
          const payloadScore = payload.value.replace("ms", "");
          const currentScoreNumber = parseInt(currentScore, 10);
          const payloadScoreNumber = parseInt(payloadScore, 10);
          if (
            payloadScoreNumber < currentScoreNumber &&
            state.highscore[payload.type] !== ""
          ) {
            state.highscore[payload.type] = payload.value;
            localStorage.setItem(
              "human-benchmark-state",
              JSON.stringify(state)
            );
          } else if (state.highscore[payload.type] === "") {
            state.highscore[payload.type] = payload.value;
            localStorage.setItem(
              "human-benchmark-state",
              JSON.stringify(state)
            );
          }
        }
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

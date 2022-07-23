import Vue from "vue";
import Vuex from "vuex";
import { uuid } from "vue-uuid";
import axios from "axios";

Vue.use(Vuex);

interface State {
  isDarkMode: boolean;
  highscore: Highscore;
  pseudo: string;
  dictionary: unknown;
}

interface Highscore {
  sequenceMemoryScore: number;
  numberMemoryScore: number;
  reactionTimeScore: string;
  verbalMemoryScore: number;
}

enum HighscoreLabels {
  sequenceMemoryScore = "sequenceMemoryScore",
  numberMemoryScore = "numberMemoryScore",
  reactionTimeScore = "reactionTimeScore",
  verbalMemoryScore = "verbalMemoryScore",
}

interface HighScorePayload {
  type: HighscoreLabels;
  value: number | string;
}

const UUID = uuid.v1();

function replacer(key: string, value: unknown) {
  if (key === "dictionary") return undefined;
  else return value;
}

export default new Vuex.Store({
  state() {
    return {
      isDarkMode: false,
      highscore: {
        sequenceMemoryScore: 0,
        numberMemoryScore: 0,
        reactionTimeScore: "",
        verbalMemoryScore: 0,
      } as Highscore,
      pseudo: UUID,
      dictionary: {},
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
    getDictionary(state: State) {
      return state.dictionary;
    },
  },
  mutations: {
    setMode(state: State, value: boolean) {
      state.isDarkMode = value;

      localStorage.setItem(
        "human-benchmark-state",
        JSON.stringify(state, replacer)
      );
    },
    setScore(state: State, payload: HighScorePayload) {
      if (payload.type != HighscoreLabels.reactionTimeScore) {
        if (
          payload.value > state.highscore[payload.type] &&
          typeof payload.value === "number"
        ) {
          state.highscore[payload.type] = payload.value;
          localStorage.setItem(
            "human-benchmark-state",
            JSON.stringify(state, replacer)
          );
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
              JSON.stringify(state, replacer)
            );
          } else if (state.highscore[payload.type] === "") {
            state.highscore[payload.type] = payload.value;
            localStorage.setItem(
              "human-benchmark-state",
              JSON.stringify(state, replacer)
            );
          }
        }
      }
    },
    setPseudo(state: State, value: string) {
      state.pseudo = value;
      localStorage.setItem(
        "human-benchmark-state",
        JSON.stringify(state, replacer)
      );
    },
    setDictionary(state: State, value: unknown) {
      state.dictionary = value;
    },
  },
  actions: {
    async fetchDictionary(context) {
      await axios.get("/dictionary/dictionary.json").then((response) => {
        context.commit("setDictionary", Object.entries(response.data));
      });
    },
  },
  modules: {},
});

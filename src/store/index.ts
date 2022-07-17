import Vue from "vue";
import Vuex from "vuex";
import { uuid } from "vue-uuid";

Vue.use(Vuex);

interface State {
  isDarkMode: boolean;
  highscore: number;
  pseudo: string;
}

const UUID = uuid.v1();

export default new Vuex.Store({
  state() {
    return {
      isDarkMode: false,
      highscore: 0,
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
    setScore(state: State, value: number) {
      if (value > state.highscore) {
        state.highscore = value;
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

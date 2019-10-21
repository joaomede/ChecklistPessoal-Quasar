import Vue from "vue";
import Vuex from "vuex";
import Firebase from "firebase";
import { db, timestamp } from "../boot/main";
import { Cookies } from "quasar";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    nomeDoUsuario: "",
    ultimaVersao: null,
    pastaAtual: null,
    quadroAtual: null
  },
  getters: {
    getUser: state => {
      return state.user;
    },
    getNomeUsuario: state => {
      return state.nomeDoUsuario;
    },
    getUltimaVersao: state => {
      return state.ultimaVersao;
    },
    getNomeDaPastaAtual(state){
      return state.pastaAtual;
    },
    getNomeDoQuadroAtual(state){
      return state.quadroAtual;
    }
  },
  mutations: {
    setUser(state) {
      const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies; // otherwise we're on client
      const user = cookies.get("user");

      if (user != null) {
        state.user = { uid: user.uid, email: user.email };
      } else {
        state.user = { uid: null, email: null };
      }
    },
    carregaNomeDoUsuario(state) {
      if (state.user == null) {
        state.nomeDoUsuario = null;
        return;
      }

      db.collection("app")
        .doc(state.user.uid)
        .get()
        .then(docs => {
          state.nomeDoUsuario = docs.data().nomeDoUsuario;
        })
        .catch(() => {
          console.log("Erro ao tentar verificar nome do usuário");
        });
    },
    DefineUltimaVersao(state, objeto) {
      state.ultimaVersao = objeto;
    },
    definePastaAtual(state, payload) {
      state.pastaAtual = payload;
    },
    defineQuadroAtual(state, payload) {
      state.quadroAtual = payload;
    }
  },
  actions: {
    setUser({ commit }) {
      commit("setUser");
    },
    carregaNomeDoUsuario({ commit }) {
      commit("carregaNomeDoUsuario");
    },
    DefineUltimaVersao({ commit }, ultimaVersao) {
      commit("DefineUltimaVersao", ultimaVersao);
    },
    definePastaAtual({ commit }, payload) {
      commit("definePastaAtual", payload);
    },
    defineQuadroAtual({ commit }, payload) {
      commit("defineQuadroAtual", payload);
    }
  }
});

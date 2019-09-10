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
    PushIDPasta: "",
    PushIDQuadro: "",
    NomeDaPastastate: "",
    NomedoQuadrostate: ""
  },
  getters: {
    getUser: state => {
      return state.user;
    },
    getNomeUsuario: state => {
      return state.nomeDoUsuario;
    },
    getPushIDPasta: state => {
      return state.PushIDPasta;
    },
    getPushIDQuadro: state => {
      return state.PushIDQuadro;
    },
    getNomeDaPasta: state => {
      return state.NomeDaPastastate;
    },
    getNomeDoQuadro: state => {
      return state.NomedoQuadrostate;
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
    carregaNomeDoUsuario(state, nome) {
      if (state.user == null) {
        return;
      }

      db.collection("app")
        .doc(state.user.uid)
        .get()
        .then(docs => {
          state.nomeDoUsuario = docs.data().nomeDoUsuario;
        })
        .catch(() => {
          this.$notificacao("Erro ao tentar verificar nome do usuário", "red");
        });
    },
    SetPushIDpasta(state, PushIDpasta) {
      state.PushIDPasta = PushIDpasta;
    },
    SetPushIDquadro(state, PushIDQuadro) {
      state.PushIDQuadro = PushIDQuadro;
    },
    SetNomeDaPasta(state, NomeDaPasta) {
      state.NomeDaPastastate = NomeDaPasta;
    },
    SetNomeDoQuadro(state, NomeDoQuadro) {
      state.NomedoQuadrostate = NomeDoQuadro;
    }
  },
  actions: {
    setUser({ commit }) {
      commit("setUser");
    },
    carregaNomeDoUsuario({ commit }) {
      commit("carregaNomeDoUsuario");
    },
    gravaUltimoAcesso() {
      let usuario = Firebase.auth().currentUser.uid;

      const objeto = {
        ultimoAcesso: timestamp
      };

      db.collection("app")
        .doc(usuario)
        .update(objeto)
        .then(() => {
          this.$notificacao("Ultimo acesso atualizado", "green");
        })
        .catch(() => {
          this.$notificacao("Acesso não atualizado", "red");
        });
    },
    SetPushIDpasta({ commit }, PushIDPasta) {
      commit("SetPushIDpasta", PushIDPasta);
    },
    SetPushIDquadro({ commit }, PushIDQuadro) {
      commit("SetPushIDquadro", PushIDQuadro);
    },
    SetNomeDaPasta({ commit }, NomeDaPasta) {
      commit("SetNomeDaPasta", NomeDaPasta);
    },
    SetNomeDoQuadro({ commit }, NomeDoQuadro) {
      commit("SetNomeDoQuadro", NomeDoQuadro);
    }
  }
});

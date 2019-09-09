import Vue from 'vue'
import Vuex from 'vuex'
import Firebase from 'firebase'
import { db, timestamp } from '../boot/main'

Vue.use(Vuex)


export default new Vuex.Store({
    state: {
        user: null,
        nomeDoUsuario: "",
        PushIDPasta: "",
        PushIDQuadro: "",
        NomeDaPastastate: "",
        NomedoQuadrostate: "",
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
        getNomeDaPasta: state =>{
            return state.NomeDaPastastate;
        },
        getNomeDoQuadro: state =>{
            return state.NomedoQuadrostate;
        }

    },
    mutations: {
        setUser: state => {
            state.user = Firebase.auth().currentUser;
        },
        carregaNomeDoUsuario(state, nome) {
            state.nomeDoUsuario = nome;
        },
        SetPushIDpasta(state, PushIDpasta){
            state.PushIDPasta = PushIDpasta;
        },
        SetPushIDquadro(state, PushIDQuadro){
            state.PushIDQuadro = PushIDQuadro;
        },
        SetNomeDaPasta(state, NomeDaPasta){
            state.NomeDaPastastate = NomeDaPasta;
        },
        SetNomeDoQuadro(state, NomeDoQuadro){
            state.NomedoQuadrostate = NomeDoQuadro;
        }
    },
    actions: {
        setUser: context => {
            context.commit('setUser');
        },
        carregaNomeDoUsuario ({commit}) {
            const usuario = Firebase.auth().currentUser;

            if (usuario === null){
                return;
            }

            db.collection("app").doc(usuario.uid).get()
            .then(docs =>{
                const nome = docs.data().nomeDoUsuario;
                
                commit('carregaNomeDoUsuario', nome)
            });
        },
        gravaUltimoAcesso() {
            let usuario = Firebase.auth().currentUser.uid;
            
            const objeto = {
                ultimoAcesso: timestamp
            }

            db.collection("app")
            .doc(usuario)
            .update(objeto)
            .then(() => {
                console.log("Ultimo acesso atualizado");
            })
            .catch(() => {
                console.log("Acesso não atualizado");
            });
        },
        SetPushIDpasta({commit}, PushIDPasta){
            commit('SetPushIDpasta', PushIDPasta)
        },
        SetPushIDquadro({commit}, PushIDQuadro){
            commit('SetPushIDquadro', PushIDQuadro)
        },
        SetNomeDaPasta({commit}, NomeDaPasta){
            commit('SetNomeDaPasta', NomeDaPasta)
        },
        SetNomeDoQuadro({commit}, NomeDoQuadro){
            commit('SetNomeDoQuadro', NomeDoQuadro)
        }
    },
});
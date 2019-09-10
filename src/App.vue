<template>
  <div id="q-app" class="q-pa-md">
    <q-layout view="lHr lpR lFr">
      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="left = !left" />

          <q-toolbar-title>CheckList Pessoal</q-toolbar-title>
          <q-btn class="q-mr-xs" dense round flat icon="new_releases" to="/feedversion" v-if="user">
            <q-badge color="red" floating transparent>{{ this.versaoUltima }}</q-badge>
          </q-btn>
          <q-btn class="q-mr-xs" dense round flat icon="new_releases" v-if="!user">
            <q-badge color="red" floating transparent>{{ this.versaoUltima }}</q-badge>
          </q-btn>
          <q-btn flat round dense icon="vpn_key" class="q-mr-xs" v-if="!user.uid" to="/login" />
          <q-btn alt="Sair" flat round dense icon="exit_to_app" @click="logout" v-if="user.uid" />
        </q-toolbar>
      </q-header>

      <q-drawer v-model="left" side="left" overlay bordered>
        <q-scroll-area
          style="height: calc(100% - 150px);
          margin-top: 150px; 
          border-right: 1px solid #ddd"
        >
          <q-list padding>
            <q-item clickable v-ripple to="/dash">
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>

              <q-item-section>Tela Inicial</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="feedversion" v-if="user">
              <q-item-section avatar>
                <q-icon name="fas fa-sync-alt" />
              </q-item-section>
              <q-item-section>Atualizações</q-item-section>
            </q-item>

            <q-item clickable v-ripple v-if="user" to="/trocarsenha">
              <q-item-section avatar>
                <q-icon name="vpn_key" />
              </q-item-section>

              <q-item-section>Trocar Senha</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/sobre">
              <q-item-section avatar>
                <q-icon name="question_answer" />
              </q-item-section>

              <q-item-section>Sobre</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <div class="text-weight-bold">{{ nomeUsuario }}</div>
            <div>{{ emailUsuario }}</div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>

      <q-footer reveal elevated class="bg-grey-8 text-white">
        <q-toolbar>
          <q-toolbar-title>Organize-se - {{this.versao}}</q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>


<script>
import firebase from "firebase";
import router from "./router";
import { db, dbfeed } from "./boot/main";

export default {
  name: "App",
  data() {
    return {
      left: false,
      login: null,
      drawer: null,
      emailUsuario: null,
      versaoUltima: null,
      versao: "v1.17.18"
    };
  },
  methods: {
    carregaNomeDoUsuario() {
      this.$store.dispatch("carregaNomeDoUsuario");
    },
    logout() {
      firebase.auth().signOut();
      this.$q.cookies.remove("user");
      this.$store.dispatch("setUser");
      this.$router.replace("login");
    },
    verificaSeEstaLogado() {
      if (this.user.uid != null) {
        this.emailUsuario = this.user.email;
      } else {
        this.emailUsuario = "sem@email.com";
      }
    },
    verificaVersaoCloud() {
      dbfeed
        .collection("app")
        .doc("nsArXKTPGLVF471Jd3Lv")
        .collection("feed")
        .where("novo", "==", true)
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.versaoUltima = doc.data().tituloPostagem;
          });
          this.$store.dispatch("DefineUltimaVersao", this.versaoUltima);
          this.checagem();
        });
    },
    defineVersaoSistemica() {
      if (this.versaoAtual == null) {
        this.$store.dispatch("DefineVersaoDoApp", this.versao);
      }
    },
    checagem() {
      if (this.versaoUltima != this.versao) {
        window.location.reload(true);
      }
    }
  },

  mounted() {
    this.verificaVersaoCloud();
    this.$store.dispatch("setUser");
    this.carregaNomeDoUsuario();
    this.verificaSeEstaLogado();
  },
  computed: {
    versionUpdate() {
      if (this.$store.getters.getUltimaVersao) {
        return this.checagem();
      } else {
        return;
      }
    },
    user() {
      if (this.$store.getters.getUser != null) {
        return this.$store.getters.getUser;
      } else {
        return { uid: null, email: null };
      }
    },
    nomeUsuario() {
      if (this.user.uid != null) {
        return this.$store.getters.getNomeUsuario;
      } else {
        return "Usuario";
      }
    }
  }
};
</script>

<style>
</style>
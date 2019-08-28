<template>
  <div id="q-app" class="q-pa-md">
    <q-layout view="lHr lpR lFr">
      <q-header elevated class="bg-primary text-white">


        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="left = !left"/>

          <q-toolbar-title>CheckList Pessoal</q-toolbar-title>

          <q-btn dense flat round icon="home" v-if="user" to="/dash"/>
          <q-btn flat round dense icon="vpn_key" class="q-mr-xs" v-if="!user" to="/login"/>
          <q-btn alt="Sair" flat round dense icon="exit_to_app" @click="logout" v-if="user"/>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="left" side="left" overlay bordered>
        <q-scroll-area
          style="height: calc(100% - 150px);
          margin-top: 150px; 
          border-right: 1px solid #ddd"
        >
          <q-list padding>
            <q-item clickable v-ripple to="dash">
              <q-item-section avatar>
                <q-icon name="dashboard"/>
              </q-item-section>

              <q-item-section>Tela Inicial</q-item-section>
            </q-item>

            <q-item clickable v-ripple v-if="user" to="trocarsenha">
              <q-item-section avatar>
                <q-icon name="vpn_key"/>
              </q-item-section>

              <q-item-section>Trocar Senha</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="sobre">
              <q-item-section avatar>
                <q-icon name="question_answer"/>
              </q-item-section>

              <q-item-section>Sobre</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img
          class="absolute-top"
          src="https://cdn.quasar.dev/img/material.png"
          style="height: 150px"
        >
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <div class="text-weight-bold">{{ nomeUsuario }}</div>
            <div>{{ emailUsuario }}</div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <router-view/>
      </q-page-container>

      <q-footer reveal elevated class="bg-grey-8 text-white">
        <q-toolbar>
          <q-toolbar-title>Organize-se</q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>


<script>
import firebase from "firebase";
import router from "./router";
import { db } from "./boot/main";

export default {
  name: "App",
  data() {
    return {
      left: false,
      login: null,
      drawer: null,
      emailUsuario: ""
    };
  },
  methods: {
    setUser: function() {
      this.$store.dispatch("setUser");
      this.$store.dispatch("CarregaNomeDoUsuario");
    },
    CarregaNomeDoUsuario: function() {
      this.$store.dispatch("CarregaNomeDoUsuario");
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => this.$router.replace("/login"));
    },
    verificaSeEstaLogado() {
      if (this.$store.getters.getUser != null) {
        this.emailUsuario = this.$store.getters.getUser.email;
        this.alertaLoginSucesso = false;
      } else {
        this.emailUsuario = "@email";
      }
    },
    minimize() {
      if (process.env.MODE === "electron") {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize();
      }
    },

    maximize() {
      if (process.env.MODE === "electron") {
        const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow();

        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }
    },

    closeApp() {
      if (process.env.MODE === "electron") {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().close();
      }
    }
  },

  created() {
    this.CarregaNomeDoUsuario();
    this.setUser();
    this.verificaSeEstaLogado();
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    nomeUsuario() {
      if (this.$store.getters.getUser != null) {
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
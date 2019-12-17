<template>
  <div id="q-app">
    <q-layout view="lHr lpR lFr">
      <q-header
        elevated
        class="bg-primary text-white"
      >
        <q-toolbar>
          <q-btn
            dense
            flat
            round
            icon="menu"
            @click="left = !left"
          />

          <q-toolbar-title>CheckList Pessoal</q-toolbar-title>
          <q-btn
            v-if="user"
            class="q-mr-xs"
            dense
            round
            flat
            icon="new_releases"
            to="/feedversion"
          >
            <q-badge
              color="red"
              floating
              transparent
            >
              {{ versaoUltima }}
            </q-badge>
          </q-btn>
          <q-btn
            v-if="!user"
            class="q-mr-xs"
            dense
            round
            flat
            icon="new_releases"
          >
            <q-badge
              color="red"
              floating
              transparent
            >
              {{ versaoUltima }}
            </q-badge>
          </q-btn>
          <q-btn
            v-if="!user.uid"
            flat
            round
            dense
            icon="vpn_key"
            class="q-mr-xs"
            to="/login"
          />
          <q-btn
            v-if="user.uid"
            alt="Sair"
            flat
            round
            dense
            icon="exit_to_app"
            @click="logout"
          />
        </q-toolbar>
        <q-breadcrumbs
          v-if="$q.platform.is.mobile"
          align="center"
          active-color="white"
          style="font-size: 14px"
        >
          <q-breadcrumbs-el
            icon="home"
            to="/dash"
          />
          <q-breadcrumbs-el
            v-if="pastaAtual.idPasta != null"
            :to="'/quadro/' + pastaAtual.idPasta"
            :label="pastaAtual.nomeDaPasta"
            icon="folder"
          />
          <q-breadcrumbs-el
            v-if="quadroAtual.idQuadro != null"
            :label="quadroAtual.nomeDoQuadro"
            icon="folder"
          />
        </q-breadcrumbs>

        <q-breadcrumbs
          v-if="$q.platform.is.desktop"
          align="center"
          active-color="white"
          style="font-size: 20px"
        >
          <q-breadcrumbs-el
            label="Home"
            icon="home"
            to="/dash"
          />
          <q-breadcrumbs-el
            v-if="pastaAtual.idPasta != null"
            :to="'/quadro/' + pastaAtual.idPasta"
            :label="pastaAtual.nomeDaPasta"
            icon="folder"
          />
          <q-breadcrumbs-el
            v-if="quadroAtual.idQuadro != null"
            :label="quadroAtual.nomeDoQuadro"
            icon="folder"
          />
        </q-breadcrumbs>
      </q-header>

      <q-drawer
        v-model="left"
        :width="200"
        side="left"
        overlay
        bordered
      >
        <q-scroll-area class="scrollArea">
          <q-list padding>
            <q-item
              v-ripple
              clickable
              to="/dash"
            >
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>

              <q-item-section>Tela Inicial</q-item-section>
            </q-item>

            <q-item
              v-if="user"
              v-ripple
              clickable
              to="feedversion"
            >
              <q-item-section avatar>
                <q-icon name="fas fa-sync-alt" />
              </q-item-section>
              <q-item-section>Atualizações</q-item-section>
            </q-item>

            <q-item
              v-if="user"
              v-ripple
              clickable
              to="/trocarsenha"
            >
              <q-item-section avatar>
                <q-icon name="vpn_key" />
              </q-item-section>

              <q-item-section>Trocar Senha</q-item-section>
            </q-item>

            <q-item
              v-ripple
              clickable
              to="/about"
            >
              <q-item-section avatar>
                <q-icon name="question_answer" />
              </q-item-section>

              <q-item-section>About</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img
          class="absolute-top"
          src="https://cdn.quasar.dev/img/material.png"
          style="height: 150px"
        >
          <div class="absolute-bottom bg-transparent">
            <q-avatar
              size="56px"
              class="q-mb-sm"
            >
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <div class="text-weight-bold">
              {{ nomeUsuario }}
            </div>
            <div>{{ emailUsuario }}</div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>

      <q-footer
        reveal
        elevated
        class="bg-grey-8 text-white"
      >
        <q-toolbar>
          <q-toolbar-title>Organize-se - {{ versao }}</q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'App',
  data () {
    return {
      left: false,
      login: null,
      emailUsuario: null
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    nomeUsuario () {
      if (this.user.uid != null) {
        return this.$store.getters.getNomeUsuario
      } else {
        return 'Usuario'
      }
    },
    pastaAtual () {
      if (this.$store.getters.getPastaAtual != null) {
        return this.$store.getters.getPastaAtual
      } else {
        return null
      }
    },
    quadroAtual () {
      if (this.$store.getters.getQuadroAtual != null) {
        return this.$store.getters.getQuadroAtual
      } else {
        return null
      }
    }
  },

  mounted () {
    this.$store.dispatch('boot')
    this.carregausername()
    this.verificaSeEstaLogado()
  },
  methods: {
    logout () {
      firebase.auth().signOut()
      this.$q.cookies.remove('user')
      this.$store.dispatch('setUser')
      this.$router.replace('login')
    },
    verificaSeEstaLogado () {
      if (this.user.uid != null) {
        this.emailUsuario = this.user.email
      } else {
        this.emailUsuario = 'sem@email.com'
      }
    }
  }
}
</script>

<style>
</style>

<template>
  <div class="q-pa-md">
    <q-form>
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">Alterar senha</div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input v-model="senha1" type="password" :rules="senhaRules" label="Senha" required filled lazy-rules></q-input>
            <q-input v-model="senha2" type="password" :rules="senhaRules" label="Repita a senha" required filled lazy-rules />
          </q-form>
        </q-card-section>

        <q-card-section>
          <q-btn color="primary" @click.stop="dialog = true">Alterar Senha</q-btn>
        </q-card-section>
      </q-card>
    </q-form>

    <!-- caixa de diálogo adiciona pasta -->
    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Desenha realmente alterar a senha?</div>
        </q-card-section>

        <q-card-section>
          <q-btn color="primary" @click="trocarSenha">Trocar Senha</q-btn>
        </q-card-section>

        <q-card-section>
          <q-btn color="primary" @click.stop="dialog = false">Cancelar</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo senha troca com sucesso pasta -->
    <q-dialog v-model="popMensagem">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ Mensagem }}</div>
        </q-card-section>

        <q-card-section>
          <q-btn color="primary" @click.stop="popMensagem = false">Ok!</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import firebase from "firebase";
import { timestamp } from "../boot/main";

export default {
  data: () => ({
    valid: false,
    dialog: false,
    Mensagem: "",
    popMensagem: false,
    senha1: "",
    senha2: "",
    senhaRules: [v => !!v || "Senha é requerida", v => v.length >= 6 || "Precisa ter mais de 6 dígitos"]
  }),
  methods: {
    setUser: function() {
      this.$store.dispatch("setUser");
    },
    trocarSenha() {
      const user = firebase.auth().currentUser;
      if (this.senha1 === this.senha2) {
        this.user
          .updatePassword(this.senha1)
          .then(() => {
            this.$notifiy("senha atualizada", "green");
          })
          .catch(() => {
            this.$notifiy("erro ao atualizar senha", "red");
          });
        this.senha1 = "";
        this.senha2 = "";
        this.dialog = false;
        this.Mensagem = "A senha foi alterada com sucesso!";
        this.popMensagem = true;
      } else {
        this.Mensagem = "A alteração falhou!";
        this.dialog = false;
        this.popMensagem = true;
      }
    }
  },
  created() {
    this.setUser();
  },

  computed: {
    user() {
      if (this.$store.getters.getUser != null) {
        return this.$store.getters.getUser;
      } else {
        return { uid: null, email: null };
      }
    }
  }
};
</script>

<style scoped>
div {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

form > * {
  display: block;
}
</style>
/* eslint-disable */
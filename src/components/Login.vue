<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-form>
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">Login</div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input filled v-model="email" lazy-rules :rules="emailRules" type="Email" label="E-mail" required></q-input>
            <q-input filled type="Password" v-model="senha" label="Senha" lazy-rules required :rules="senhaRules" />
          </q-form>
        </q-card-section>

        <q-card-section>
          <q-btn color="primary" @click="login">Entrar</q-btn>
        </q-card-section>

        <q-card-section>
          <q-btn color="primary" to="/registrar">Registrar-se</q-btn>
        </q-card-section>

        <q-card-section>
          <q-btn color="primary" @click.stop="dialogoEsqueciSenha = true">Esqueci minha senha</q-btn>
        </q-card-section>
      </q-card>
    </q-form>

    <!-- caixa de diálogo adiciona pasta -->
    <q-dialog v-model="dialogoEsqueciSenha" transition-show="rotate" transition-hide="rotate">
      <q-card>
        <q-card-section>
          <div class="text-h6">Recupere seu acesso</div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input v-model="emailRecuperacao" label="Informe seu email de recuperação" required></q-input>
          </q-form>
        </q-card-section>

        <q-card-section>
          <q-btn color="primary" @click="recuperaAcesso">Recuperar Acesso</q-btn>
        </q-card-section>

        <q-card-section>
          <q-btn color="primary" @click.stop="dialogoEsqueciSenha = false">Voltar</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import firebase from "firebase";
import { timestamp } from "../boot/main";

export default {
  name: "Login",
  data: () => ({
    valid: false,
    dialogoEsqueciSenha: false,
    email: "",
    senha: "",
    emailRecuperacao: "",
    emailRules: [v => !!v || "E-mail é requerido", v => /.+@.+/.test(v) || "E-mail precisa ser válido"],
    senhaRules: [v => !!v || "Senha é requerida", v => v.length >= 6 || "Precisa ter mais de 6 dígitos"]
  }),
  methods: {
    setUser: function() {
      this.$store.dispatch("setUser");
    },
    gravaUltimoAcesso: function() {
      this.$store.dispatch("gravaUltimoAcesso");
    },
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.senha)
        .then(data => {
          this.$notificacao("Bem vindo de volta", "green");
          this.$router.replace("dash");
        })
        .catch(() => {
          this.$$notificacao("Erro ao tentar efetuar o login", "red");
        });
    },
    recuperaAcesso() {
      firebase
        .auth()
        .sendPasswordResetEmail(this.emailRecuperacao)
        .then(() => {
          this.$notificacao("Email de recuperação enviado com sucesso", "green");
        }).catch(()=>{
          this.$notificacao("Erro ao tentar enviar de recuperação", "red")
        })
      this.dialogoEsqueciSenha = false;
    },
    verificaEstaLogado() {
      if (this.$store.getters.getUser != null) {
        this.$router.replace("dash");
      }
    }
  },
  created() {
    this.setUser();
    this.verificaEstaLogado();
  },

  computed: {
    user() {
      return this.$store.getters.getUser;
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
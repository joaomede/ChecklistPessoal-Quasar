<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-form>
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">
            Login
          </div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              v-model="email"
              filled
              lazy-rules
              :rules="emailRules"
              type="Email"
              label="E-mail"
              required
            />
            <q-input
              v-model="senha"
              filled
              type="Password"
              label="Senha"
              lazy-rules
              required
              :rules="senhaRules"
            />
          </q-form>
        </q-card-section>

        <q-card-section>
          <q-btn
            color="primary"
            @click="login"
          >
            Entrar
          </q-btn>
        </q-card-section>

        <q-card-section>
          <q-btn
            color="primary"
            to="/register"
          >
            Registrar-se
          </q-btn>
        </q-card-section>

        <q-card-section>
          <q-btn
            color="primary"
            @click.stop="dialogForgotPassword = true"
          >
            Esqueci minha senha
          </q-btn>
        </q-card-section>
      </q-card>
    </q-form>

    <!-- caixa de diálogo adiciona pasta -->
    <q-dialog
      v-model="dialogForgotPassword"
      transition-show="rotate"
      transition-hide="rotate"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Recupere seu acesso
          </div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              v-model="email"
              label="Informe seu email de recuperação"
              required
            />
          </q-form>
        </q-card-section>

        <q-card-section>
          <q-btn
            color="primary"
            @click="recoveryLogin"
          >
            Recuperar Acesso
          </q-btn>
        </q-card-section>

        <q-card-section>
          <q-btn
            color="primary"
            @click.stop="dialogForgotPassword = false"
          >
            Voltar
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    valid: false,
    dialogForgotPassword: false,
    email: '',
    senha: '',
    emailRules: [v => !!v || 'E-mail é requerido', v => /.+@.+/.test(v) || 'E-mail precisa ser válido'],
    senhaRules: [v => !!v || 'Senha é requerida', v => v.length >= 6 || 'Precisa ter mais de 6 dígitos']
  }),
  created () {
    this.verifyIsLogged()
  },
  methods: {
    async login () {
      try {
        const result = await this.$firebase.auth().signInWithEmailAndPassword(this.email, this.senha)
        this.$q.cookies.set('user', await result.user)
        await this.$store.dispatch('boot')
        await this.$router.replace('folder')
        this.$notifiy('Bem vindo de volta', 'green')
      } catch (error) {
        this.$notifiy('Erro ao tentar efetuar o login', 'red')
      }
    },
    async recoveryLogin () {
      this.dialogForgotPassword = false
      try {
        await this.$firebase.auth().sendPasswordResetEmail(this.email)
        this.$notifiy('Email de recuperação enviado com sucesso', 'green')
      } catch (error) {
        this.$notifiy('Erro ao tentar enviar de recuperação', 'red')
      }
    },
    verifyIsLogged () {
      if (this.user.uid != null) {
        this.$router.replace('folder')
      }
    }
  }
}
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

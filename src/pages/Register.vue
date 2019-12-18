<template>
  <div
    class="boxPadrao"
    align-center
    justify-center
  >
    <q-form v-model="valid">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">
            {{ $t('register.title') }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              v-model="nome"
              :rules="rulesNome"
              :label="$t('register.questionName')"
              required
              filled
              lazy-rules
              type="text"
            />
            <q-input
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
              filled
              type="email"
              lazy-rules
            />
            <q-input
              v-model="senha"
              type="password"
              :rules="senhaRules"
              :label="$t('register.password')"
              required
              filled
              lazy-rules
            />
            <q-input
              v-model="senha2"
              type="password"
              :rules="senhaRules"
              :label="$t('register.labelRepeatPassword')"
              required
              filled
              lazy-rules
            />
          </q-form>
        </q-card-section>

        <q-card-section>
          <q-btn
            color="primary"
            @click="registrar"
          >
            {{ $t('register.btnRegister') }}
          </q-btn>
        </q-card-section>

        <q-card-section>
          <q-btn
            color="primary"
            to="login"
          >
            {{ $t('geral.back') }}
          </q-btn>
        </q-card-section>
      </q-card>
    </q-form>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data: () => ({
    valid: false,
    nome: '',
    email: '',
    senha: '',
    senha2: '',
    ultimoAcesso: '',
    uid: '',
    rulesNome: [v => !!v || 'O nome é requerido', v => v.length >= 4 || 'E-mail precisa ser válido'],
    emailRules: [v => !!v || 'E-mail é requerido', v => /.+@.+/.test(v) || 'E-mail precisa ser válido'],
    senhaRules: [v => !!v || 'Senha é requerida', v => v.length >= 6 || 'Precisa ter mais de 6 dígitos']
  }),
  methods: {
    registrar () {
      let n = this.nome
      if (n.includes('/') | n.includes('..')) {
        // entrada para metodo de alerta de caractere proibido
        return
      }

      if (this.senha === this.senha2) {
        this.$firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.senha)
          .then(data => {
            const objeto = {
              username: this.nome,
              uid: data.user.uid,
              createdAt: this.$timestamp
            }
            this.$db.collection('app')
              .doc(data.user.uid)
              .set(objeto)
              .then(() => {
                this.$router.replace('folder')
                this.$notifiy(this.$t('register.sucessRegister'), 'green')
              })
              .catch(() => {
                this.$notifiy(this.$t('register.failLogin'), 'red')
              })
          })
          .catch(() => {
            this.$notifiy(this.$t('register.failRegister'), 'red')
          })
      } else {
        this.$notifiy(this.$t('register.differentPasswords'), 'red')
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

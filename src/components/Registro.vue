<template>
  <div class="boxPadrao" align-center justify-center>
    <q-form v-model="valid">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">Registre-se</div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              v-model="nome"
              :rules="rulesNome"
              label="Qual seu nome?"
              required
              filled
              lazy-rules
              type="text"
            ></q-input>
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
              label="Senha"
              required
              filled
              lazy-rules
            />
            <q-input
              v-model="senha2"
              type="password"
              :rules="senhaRules"
              label="Repita a senha"
              required
              filled
              lazy-rules
            />
          </q-form>
        </q-card-section>

        <q-card-section>
          <q-btn color="primary" @click="registrar">Registrar-se</q-btn>
        </q-card-section>

        <q-card-section>
          <q-btn color="primary" to="login">Voltar</q-btn>
        </q-card-section>
      </q-card>
    </q-form>
  </div>
</template>

<script>
import firebase, { functions } from "firebase";
import { db, timestamp } from "../boot/main";

export default {
  name: "Registro",
  data: () => ({
    valid: false,
    nome: "",
    email: "",
    senha: "",
    senha2: "",
    ultimoAcesso: "",
    uid: "",
    rulesNome: [
      v => !!v || "O nome é requerido",
      v => v.length >= 4 || "E-mail precisa ser válido"
    ],
    emailRules: [
      v => !!v || "E-mail é requerido",
      v => /.+@.+/.test(v) || "E-mail precisa ser válido"
    ],
    senhaRules: [
      v => !!v || "Senha é requerida",
      v => v.length >= 6 || "Precisa ter mais de 6 dígitos"
    ]
  }),
  methods: {
    registrar() {
      let n = this.nome;
      if (n.includes("/") | n.includes("..")) {
        //entrada para metodo de alerta de caractere proibido
        return;
      }

      if (this.senha == this.senha2) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.senha)
          .then(data => {
            const objeto = {
              nomeDoUsuario: this.nome,
              uid: data.user.uid,
              ultimoAcesso: timestamp
            };
            db.collection("app")
              .doc(data.user.uid)
              .set(objeto)
              .then(() => {
                this.$router.replace("dash");
                console.log("Cadastro realizado com sucesso");
              })
              .catch(() => {
                console.log("Cadastro falhou " + error);
              });
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        console.log("senha diferentes");
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
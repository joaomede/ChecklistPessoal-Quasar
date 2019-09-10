<template>
  <div>
    <div class="text-h4 text-center">{{ msg }}</div>
    <!-- flutuante -->
    <q-btn round color="orange darken-2" @click.stop="dialogoAddQuadro = true" class="fixed" style="right: 18px; bottom: 60px">
      <q-icon name="add" />
    </q-btn>

    <!-- conteudo do quadro -->
    <div class="q-pa-md" style="max-width: 900px; margin: auto;">
      <q-list bordered>
        <div class="text-h5 text-center">Selecione o Quadro</div>
        <div class="text-h6 text-center">//{{ this.$store.getters.getNomeDaPasta }}</div>
        <q-item clickable v-ripple v-for="item in quadroData" :key="item.idQuadro" @click="setIDdoQuadro(item)">
          <q-item-section avatar>
            <q-avatar icon="dashboard" color="primary" text-color="secondary" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">{{ item.nomeDoQuadro }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="edit" color="blue" @click.stop="editaQuadro(item)" />
          </q-item-section>

          <q-item-section side>
            <q-icon name="delete_sweep" color="grey ligten-1" @click.stop="deletaQuadro(item)" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- caixa de diálogo edita quadro -->
    <q-dialog v-model="dialogoEditaQuadro">
      <q-card>
        <q-card-section>
          <div class="text-h6">Edite o nome do do quadro</div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input v-model="editaNomeDoQuadro" label="Informe o nome do quadro" required></q-input>
          </q-form>
        </q-card-section>

        <q-card-section align="center">
          <q-btn flat color="primary" @click="apagaQuadroDB">Salvar</q-btn>
          <q-btn flat @click.stop="dialogoEditaQuadro = false">Voltar</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo adiciona quadro -->
    <q-dialog v-model="dialogoAddQuadro">
      <q-card>
        <q-card-section>
          <div class="text-h6">Adicione um quadro</div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input v-model="nomeDoQuadro" label="Informe o nome do quadro" required></q-input>
          </q-form>
        </q-card-section>

        <q-card-section align="center">
          <q-btn flat color="primary" @click="criaQuadro">Salvar</q-btn>
          <q-btn flat color="primary" @click.stop="dialogoAddQuadro = false">Voltar</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo apagar quadro confirmação -->
    <q-dialog v-model="dialogoApagaQuadro">
      <q-card>
        <q-card-section>
          <div class="text-h6">Deseja realmente apagar este quadro?</div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">{{ this.editaNomeDoQuadro }}</div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn flat color="primary" @click="apagaQuadroDB">Sim</q-btn>
          <q-btn flat color="primary" @click.stop="dialogoApagaQuadro = false">Voltar</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import firebase from "firebase";
import { db, timestamp } from "../boot/main";

export default {
  props: ["idPasta"],
  name: "Quadro",
  data() {
    return {
      dialogoAddQuadro: false,
      dialogoEditaQuadro: false,
      dialogoApagaQuadro: false,
      msg: "Quadros",
      idQuadro: "",
      nomeDoQuadro: "",
      editaNomeDoQuadro: "",
      ref: firebase.firestore().collection("app"),
      refQuadro: firebase
        .firestore()
        .collection("app")
        .doc(this.$store.getters.getUser.uid)
        .collection("Pasta")
        .doc(this.$store.getters.getPushIDPasta)
        .collection("Quadro")
        .orderBy("nomeDoQuadro", "desc"),
      quadroData: []
    };
  },

  methods: {
    setUser: function() {
      this.$store.dispatch("setUser");
    },
    criaQuadro() {
      let b = this.nomeDoQuadro;
      if (b.includes("/") | b.includes("..")) {
        //entrada para metodo de alerta de caractere proibido
        return;
      }
      const conteudo = {
        nomeDoQuadro: this.nomeDoQuadro,
        idQuadro: this.idQuadro
      };

      db.collection("app")
        .doc(this.$store.getters.getUser.uid)
        .collection("Pasta")
        .doc(this.$store.getters.getPushIDPasta)
        .collection("Quadro")
        .add(conteudo)
        .then(ref => {
          const pushID = { idQuadro: ref.id };
          ref.update(pushID);
          this.$notificacao("Novo Quadro Adicionada", "green");
        })
        .catch(() => {
          this.$notificacao("Objeto não adicionado", "red");
        });

      this.dialogoAddQuadro = false;
      this.nomeDoQuadro = "";
    },
    carregaQuadro() {
      this.refQuadro.onSnapshot(querySnapshot => {
        this.quadroData = [];
        querySnapshot.forEach(doc => {
          this.quadroData.push({
            idQuadro: doc.id,
            nomeDoQuadro: doc.data().nomeDoQuadro
          });
        });
      });
    },
    //carrega tela tarefas
    setIDdoQuadro(item) {
      this.$store.dispatch("SetPushIDquadro", item.idQuadro);
      this.$store.dispatch("SetNomeDoQuadro", item.nomeDoQuadro);
      this.$router.replace("tarefas");
    },
    editaQuadro(item) {
      this.dialogoEditaQuadro = true;
      this.editaNomeDoQuadro = item.nomeDoQuadro;
      this.idQuadro = item.idQuadro;
    },
    deletaQuadro(item) {
      this.dialogoApagaQuadro = true;
      this.editaNomeDoQuadro = item.nomeDoQuadro;
      this.idQuadro = item.idQuadro;
    },
    apagaQuadroDB() {
      db.collection("app")
        .doc(this.$store.getters.getUser.uid)
        .collection("Pasta")
        .doc(this.$store.getters.getPushIDPasta)
        .collection("Quadro")
        .doc(this.idQuadro)
        .delete()
        .then(function() {
          this.$notificacao("Quadro apagado com sucesso", "green");
        })
        .catch(() => {
          this.$notificacao("Erro ao tentar apagar o contrato", "red");
        });
      this.dialogoApagaQuadro = false;
    },
    apagaQuadroDB() {
      let b = this.editaNomeDoQuadro;
      if (b.includes("/") | b.includes("..")) {
        //entrada para metodo de alerta de caractere proibido
        return;
      }
      const objeto = {
        nomeDoQuadro: this.editaNomeDoQuadro
      };
      db.collection("app")
        .doc(this.$store.getters.getUser.uid)
        .collection("Pasta")
        .doc(this.$store.getters.getPushIDPasta)
        .collection("Quadro")
        .doc(this.idQuadro)
        .update(objeto)
        .then(() => {
          this.$notificacao("Quadro excluído com sucesso", "green");
        })
        .catch(() => {
          this.$notificacao("Erro ao tentar excluir o quadro", "red");
        });
      this.dialogoEditaQuadro = false;
      this.editaNomeDoQuadro = "";
    }
  },
  created() {
    this.carregaQuadro();
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
form > * {
  display: block;
}
</style>

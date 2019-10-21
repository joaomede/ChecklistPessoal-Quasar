<template>
  <div>
    <div class="text-h4 text-center">{{ msg }}</div>
    <!-- flutuante -->
    <q-btn round color="orange darken-2" @click.stop="$router.go(-1)" class="fixed fabLeft">
      <q-icon name="fas fa-arrow-left" />
    </q-btn>
    <q-btn round color="orange darken-2" @click.stop="(dialogoAddQuadro = true), resetForm()" class="fixed fabRight">
      <q-icon name="add" />
    </q-btn>

    <!-- conteudo do quadro -->
    <div class="q-pa-md divPrincipal">
      <q-list bordered>
        <div class="text-h5 text-center">Selecione o Quadro</div>
        <q-item clickable v-ripple v-for="item in quadroData" :key="item.idQuadro" @click="carregaTarefas(item)">
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
            <q-input v-model="nomeDoQuadro" label="Informe o nome do quadro" required></q-input>
          </q-form>
        </q-card-section>

        <q-card-section align="center">
          <q-btn class="q-ma-xs" color="black" @click.stop="dialogoEditaQuadro = false">Voltar</q-btn>
          <q-btn class="q-ma-xs" color="green" @click="salvaEdicao()">Salvar</q-btn>
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
          <q-btn class="q-ma-xs" color="black" @click.stop="dialogoAddQuadro = false">Voltar</q-btn>
          <q-btn class="q-ma-xs" color="green" @click="criaQuadro">Salvar</q-btn>
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
          <div class="text-h6">{{ this.nomeDoQuadro }}</div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn class="q-ma-xs" color="black" @click.stop="dialogoApagaQuadro = false">Voltar</q-btn>
          <q-btn class="q-ma-xs" color="green" @click="apagaQuadroDB()">Sim</q-btn>
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
      quadroData: [],
    };
  },
  watch: {
    refQuadro: "init",
    user: "init"
  },
  methods: {
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
        .doc(this.user.uid)
        .collection("Pasta")
        .doc(this.idPasta)
        .collection("Quadro")
        .add(conteudo)
        .then(ref => {
          const pushID = { idQuadro: ref.id };
          ref.update(pushID);
          this.$notifiy("Novo Quadro Adicionada", "green");
        })
        .catch(() => {
          this.$notifiy("Objeto não adicionado", "red");
        });

      this.dialogoAddQuadro = false;
      this.nomeDoQuadro = "";
    },
    init() {
      this.carregaPastaAtual();
      this.carregaQuadro();
    },
    carregaQuadro() {
      if ((this.user.uid != null) & (this.refQuadro != null)) {
        this.refQuadro.onSnapshot(querySnapshot => {
          this.quadroData = [];
          querySnapshot.forEach(doc => {
            this.quadroData.push({
              idQuadro: doc.id,
              nomeDoQuadro: doc.data().nomeDoQuadro
            });
          });
        });
      }
    },
    carregaPastaAtual() {
      if (this.refPasta != null) {
        this.refPasta
          .get()
          .then(resp => {
            this.$store.dispatch("definePastaAtual", resp.data().nomeDaPasta);
            this.$store.dispatch("defineQuadroAtual", null);
          })
          .catch(err => {
            this.$notifiy(err, "red");
          });
      }
    },
    carregaTarefas(item) {
      this.$router.push({ name: "Tarefas", params: { idQuadro: item.idQuadro, idPasta: this.idPasta } });
    },
    editaQuadro(item) {
      this.dialogoEditaQuadro = true;
      this.nomeDoQuadro = item.nomeDoQuadro;
      this.idQuadro = item.idQuadro;
    },
    deletaQuadro(item) {
      this.dialogoApagaQuadro = true;
      this.nomeDoQuadro = item.nomeDoQuadro;
      this.idQuadro = item.idQuadro;
    },
    apagaQuadroDB() {
      db.collection("app")
        .doc(this.user.uid)
        .collection("Pasta")
        .doc(this.idPasta)
        .collection("Quadro")
        .doc(this.idQuadro)
        .delete()
        .then(() => {
          this.$notifiy("Quadro apagado com sucesso", "green");
        })
        .catch(() => {
          this.$notifiy("Erro ao tentar apagar o contrato", "red");
        });
      this.dialogoApagaQuadro = false;
    },
    salvaEdicao() {
      let b = this.nomeDoQuadro;
      if (b.includes("/") | b.includes("..")) {
        //entrada para metodo de alerta de caractere proibido
        return;
      }
      const objeto = {
        nomeDoQuadro: this.nomeDoQuadro
      };
      db.collection("app")
        .doc(this.user.uid)
        .collection("Pasta")
        .doc(this.idPasta)
        .collection("Quadro")
        .doc(this.idQuadro)
        .update(objeto)
        .then(() => {
          this.$notifiy("Quadro excluído com sucesso", "green");
        })
        .catch(() => {
          this.$notifiy("Erro ao tentar excluir o quadro", "red");
        });
      this.dialogoEditaQuadro = false;
      this.nomeDoQuadro = "";
    },
    resetForm() {
      this.nomeDoQuadro = null;
    }
  },
  mounted() {
    this.init();
  },
  computed: {
    user() {
      if (this.$store.getters.getUser != null) {
        return this.$store.getters.getUser;
      } else {
        return { uid: null, email: null };
      }
    },
    refQuadro() {
      if (this.user.uid != null) {
        return firebase
          .firestore()
          .collection("app")
          .doc(this.user.uid)
          .collection("Pasta")
          .doc(this.idPasta)
          .collection("Quadro")
          .orderBy("nomeDoQuadro", "desc");
      } else {
        return null;
      }
    },
    refPasta() {
      if (this.user.uid != null) {
        return firebase
          .firestore()
          .collection("app")
          .doc(this.user.uid)
          .collection("Pasta")
          .doc(this.idPasta);
      } else {
        return null;
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

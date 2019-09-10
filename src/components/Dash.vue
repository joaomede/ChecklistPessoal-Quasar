<template>
  <div>
    <div class="text-h4 text-center">{{ msg }}</div>
    <!-- flutuante -->
    <!-- flutuante -->
    <q-btn round color="orange darken-2" @click.stop="dialogoAddPasta = true" class="fixed" style="right: 18px; bottom: 60px">
      <q-icon name="add" />
    </q-btn>

    <!-- conteudo pasta -->
    <div class="q-pa-md" style="max-width: 900px; margin: auto;">
      <q-list bordered>
        <div class="text-h6 text-center">Selecione sua pasta pessoal</div>

        <q-item clickable v-ripple v-for="item in pastaData" :key="item.idPasta" @click="carregaTelaQuadros(item)">
          <q-item-section avatar top>
            <q-avatar icon="folder" color="primary" text-color="secondary" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">{{ item.nomeDaPasta }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="edit" color="blue" @click.stop="editaPasta(item)" />
          </q-item-section>

          <q-item-section side>
            <q-icon name="delete_sweep" color="grey ligten-1" @click.stop="deletaPasta(item)" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- caixa de diálogo adiciona pasta -->
    <q-dialog v-model="dialogoAddPasta">
      <q-card>
        <q-card-section>
          <div class="text-h6">Adicione uma pasta</div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input v-model="nomeDaPasta" label="Informe o nome da pasta" required></q-input>
          </q-form>
        </q-card-section>

        <q-card-section align="center">
          <q-btn flat color="primary" @click="criaPasta">Salvar</q-btn>
          <q-btn flat color="primary" @click.stop="dialogoAddPasta = false">Voltar</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo edita pasta -->
    <q-dialog v-model="dialogoEditaPasta">
      <q-card>
        <q-card-section>
          <div class="text-h6">Edite o nome da pasta</div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input v-model="editaNomePasta" label="Informe o nome da pasta" required></q-input>
          </q-form>
        </q-card-section>

        <q-card-section align="center">
          <q-btn flat color="primary" @click="atualizaEditaPasta">Salvar</q-btn>
          <q-btn flat color="primary" @click.stop="dialogoEditaPasta = false">Voltar</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo apagar tarefa confirmação -->
    <q-dialog v-model="dialogoConfirmaDeletaPasta">
      <q-card>
        <q-card-section>
          <div class="text-h5">Deseja realmente apagar?</div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">{{ this.editaNomePasta }}</div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn flat color="primary" @click="apagaPastaDB">Sim</q-btn>
          <q-btn flat color="primary" @click.stop="dialogoConfirmaDeletaPasta = false">Voltar</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- lista de pastas-->
  </div>
</template>

<script>
import firebase from "firebase";
import { db, timestamp } from "../boot/main";
import router from "../router";

export default {
  name: "Dash",
  data() {
    return {
      dialogoAddPasta: false,
      dialogoEditaPasta: false,
      editaNomePasta: "",
      dialogoConfirmaDeletaPasta: false,

      msg: "Bem vindo ao App",
      idPasta: "",
      nomeDaPasta: "",
      ref: firebase.firestore().collection("app"),
      pastaData: []
    };
  },
  watch: {
    refPasta: "carregaPastas"
  },

  methods: {
    criaPasta() {
      if (this.nomeDaPasta.includes("/") || this.nomeDaPasta.includes("..")) {
        // entrada para método de alerta caractere incorreto
        return;
      }
      const conteudo = {
        nomeDaPasta: this.nomeDaPasta,
        idPasta: null
      };

      db.collection("app")
        .doc(this.$store.getters.getUser.uid)
        .collection("Pasta")
        .add(conteudo)
        .then(ref => {
          const pushID = { idPasta: ref.id };
          ref.update(pushID);
          this.$notificacao("Nova Pasta Adicionada", "green");
        })
        .catch(() => {
          this.$notificacao("objeto não adicionado", "red");
        });

      this.dialogoAddPasta = false;
      this.nomeDaPasta = "";
    },
    carregaPastas() {
      if ((this.user.uid != null) & (this.refPasta != null)) {
        this.refPasta.onSnapshot(querySnapshot => {
          this.pastaData = [];
          querySnapshot.forEach(doc => {
            this.pastaData.push({
              idPasta: doc.id,
              nomeDaPasta: doc.data().nomeDaPasta
            });
          });
        });
      }
    },
    atualizaEditaPasta() {
      let a = this.editaNomePasta;
      if (a.includes("/") || a.includes("..")) {
        // entrada para método de alerta caractere incorreto
        return;
      }
      const objeto = {
        nomeDaPasta: this.editaNomePasta
      };
      db.collection("app")
        .doc(this.$store.getters.getUser.uid)
        .collection("Pasta")
        .doc(this.idPasta)
        .update(objeto)
        .then(() => {
          this.$notificacao("Ultimo acesso atualizado", "green");
        })
        .catch(() => {
          this.$notificacao("Acesso não atualizado", "red");
        });
      this.dialogoEditaPasta = false;
      this.editaNomePasta = "";
    },
    apagaPastaDB() {
      db.collection("app")
        .doc(this.user.uid)
        .collection("Pasta")
        .doc(this.idPasta)
        .delete()
        .then(function() {
          this.$notificacao("Pasta removida com sucesso", "green");
        })
        .catch(() => {
          this.$notificacao("Erro ao tentar remover pasta", "red");
        });
      this.dialogoConfirmaDeletaPasta = false;
    },
    //carrega tela quadros
    carregaTelaQuadros(item) {
      this.$router.push({
        name: "Quadro",
        params: { idPasta: item.idPasta }
      });
    },
    editaPasta(item) {
      this.dialogoEditaPasta = true;
      this.editaNomePasta = item.nomeDaPasta;
      this.idPasta = item.idPasta;
    },
    deletaPasta(item) {
      this.dialogoConfirmaDeletaPasta = true;
      this.editaNomePasta = item.nomeDaPasta;
      this.idPasta = item.idPasta;
    }
  },
  mounted() {
    this.carregaPastas();
  },
  computed: {
    user() {
      if (this.$store.getters.getUser != null) {
        return this.$store.getters.getUser;
      } else {
        return { uid: null, email: null };
      }
    },
    refPasta() {
      if (this.user.uid != null) {
        return firebase
          .firestore()
          .collection("app")
          .doc(this.user.uid)
          .collection("Pasta")
          .orderBy("nomeDaPasta", "desc");
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
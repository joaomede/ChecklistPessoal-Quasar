<template>
  <div>
    <div class="text-h4">{{ msg }}</div>
    <!-- flutuante -->
    <!-- flutuante -->
    <q-btn round color="orange darken-2" @click.stop="dialogoAddPasta = true" class="fixed" style="right: 18px; bottom: 60px">
      <q-icon name="add"/>
    </q-btn>


    <!-- conteudo pasta -->
    <div class="q-pa-md q-gutter-md">
      <q-list bordered padding class="rounded-borders" style="max-width: 350px">
        <div class="text-h6">Selecione sua pasta pessoal</div>

        <q-item
          clickable
          v-ripple
          v-for="item in pastaData"
          :key="item.idPasta"
          @click="CarregaTelaQuadros(item)"
        >
          <q-item-section avatar top>
            <q-avatar icon="folder" color="primary" text-color="white"/>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">{{ item.nomeDaPasta }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="edit" color="blue" @click.stop="EditaPasta(item)"/>
          </q-item-section>

          <q-item-section side>
            <q-icon name="delete_sweep" color="grey ligten-1" @click.stop="DeletaPasta(item)"/>
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

        <q-card-section>
          <q-btn color="primary" @click="CriaPasta">Salvar</q-btn>
        </q-card-section>

        <q-card-section>
          <q-btn color="primary" @click.stop="dialogoAddPasta = false">Voltar</q-btn>
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

        <q-card-section>
          <q-btn color="primary" @click="AtualizaEditaPasta">Salvar</q-btn>
        </q-card-section>

        <q-card-section>
          <q-btn color="primary" @click.stop="dialogoEditaPasta = false">Voltar</q-btn>
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
          <div class="text-h6">{{this.editaNomePasta}}</div>
        </q-card-section>

        <q-card-section>
          <q-btn color="primary" @click="ApagaPastaDB">Sim</q-btn>
        </q-card-section>

        <q-card-section>
          <q-btn color="primary" @click.stop="dialogoConfirmaDeletaPasta = false">Voltar</q-btn>
        </q-card-section>

      </q-card>
    </q-dialog>

    <!-- lista de pastas-->
  </div>
</template>

<script>
import firebase from "firebase";
import { db, timestamp } from "../boot/main";

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
      refPastas: firebase
        .firestore()
        .collection("app")
        .doc(this.$store.getters.getUser.uid)
        .collection("Pasta")
        .orderBy("nomeDaPasta", "desc"),
      pastaData: []
    };
  },

  methods: {
    setUser: function() {
      this.$store.dispatch("setUser");
    },
    CriaPasta() {
      if (this.nomeDaPasta.includes("/") || this.nomeDaPasta.includes("..")) {
        // entrada para método de alerta caractere incorreto
        return;
      }
      const conteudo = {
        nomeDaPasta: this.nomeDaPasta,
        idPasta: this.idPasta
      };

      db.collection("app")
        .doc(this.$store.getters.getUser.uid)
        .collection("Pasta")
        .add(conteudo)
        .then(ref => {
          const pushID = { idPasta: ref.id };
          ref.update(pushID);
          console.log("Nova Pasta Adicionada");
        })
        .catch(() => {
          console.log("objeto não adicionado");
        });

      this.dialogoAddPasta = false;
      this.nomeDaPasta = "";
    },
    CarregaPastas() {
      this.refPastas.onSnapshot(querySnapshot => {
        this.pastaData = [];
        querySnapshot.forEach(doc => {
          this.pastaData.push({
            idPasta: doc.id,
            nomeDaPasta: doc.data().nomeDaPasta
          });
        });
      });
    },
    AtualizaEditaPasta() {
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
          console.log("Ultimo acesso atualizado");
        })
        .catch(() => {
          console.log("Acesso não atualizado");
        });
      this.dialogoEditaPasta = false;
      this.editaNomePasta = "";
    },
    ApagaPastaDB() {
      db.collection("app")
        .doc(this.$store.getters.getUser.uid)
        .collection("Pasta")
        .doc(this.idPasta)
        .delete()
        .then(function() {
          console.log("Document successfully deleted!");
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
      this.dialogoConfirmaDeletaPasta = false;
    },
    //carrega tela quadros
    CarregaTelaQuadros(item) {
      this.$store.dispatch("SetPushIDpasta", item.idPasta);
      this.$store.dispatch("SetNomeDaPasta", item.nomeDaPasta);
      //carrega página quadro
      this.$router.replace("quadro");
    },
    EditaPasta(item) {
      this.dialogoEditaPasta = true;
      this.editaNomePasta = item.nomeDaPasta;
      this.idPasta = item.idPasta;
    },
    DeletaPasta(item) {
      this.dialogoConfirmaDeletaPasta = true;
      this.editaNomePasta = item.nomeDaPasta;
      this.idPasta = item.idPasta;
    }
  },
  created() {
    this.setUser();
    this.CarregaPastas();
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
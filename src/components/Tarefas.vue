<template>
  <div class="q-pa-none">
    <!-- flutuante -->
    <q-btn round color="orange darken-2" @click.stop="$router.go(-1)" class="fixed fabLeft">
      <q-icon name="fas fa-arrow-left" />
    </q-btn>
    <q-btn round color="orange darken-2" @click.stop="dialogoAddTarefa = true" class="fixed fabRight">
      <q-icon name="add" />
    </q-btn>
    <div class="text-h5 text-center">Tarefas</div>

    <!-- tabs -->
    <div style="max-width: 900px; margin: auto;">
      <q-card>
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
          <q-tab name="ativo" label="Ativas" />
          <q-tab name="concluido" label="Concluídas" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="ativo" style="padding: 0px">
            <!-- Tab tarefas ativas -->
            <q-list bordered style="max-width: 900px; margin: auto;">
              <div class="text-h5 text-center">/{{ nomePasta }}/{{ nomeQuadro }}/</div>

              <q-item clickable v-ripple v-for="item in tarefasAtivaData" :key="item.idTarefa" @click="exibeDetalhesAtiva(item)">
                <q-item-section avatar top>
                  <q-avatar icon="event_note" color="primary" text-color="white" />
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">{{ item.nomeDaTarefa }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon name="check" color="primary" @click.stop="exibeDialogoConcluirTarefa(item)" />
                </q-item-section>

                <q-item-section side>
                  <q-icon name="delete_sweep" color="grey ligten-1" @click.stop="dialogoDeletaTarefa(item)" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>

          <q-tab-panel name="concluido" style="padding: 0px">
            <!-- Tab tarefas concluídas -->
            <q-list bordered style="max-width: 900px; margin: auto;">
              <div class="text-h5 text-center">/{{ this.nomePasta }}/{{ this.nomeQuadro }}/</div>

              <q-item clickable v-ripple v-for="item in tarefasConcluidaData" :key="item.idTarefa" @click="exibeDetalhesConcluida(item)">
                <q-item-section avatar top>
                  <q-avatar icon="event_note" color="primary" text-color="white" />
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">{{ item.nomeDaTarefa }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon name="restore" color="primary" @click.stop="dialogoRestaurar(item)" />
                </q-item-section>

                <q-item-section side>
                  <q-icon name="delete_sweep" color="grey ligten-1" @click.stop="dialogoDeletaTarefa(item)" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>

    <!-- caixa de diálogo exibe detalhes tarefas ativas -->
    <q-dialog v-model="dialogoDetalhesAtivas">
      <q-card class="text-center" style="background-color: #4fc3f7">
        <q-card-section>
          <div style="background-color: #ffcc80">
            <div class="text-h6">Titulo</div>
            <div class="text-p">{{ this.tituloDetalheAtivo }}</div>
          </div>
        </q-card-section>

        <q-card-section> </q-card-section>

        <q-card-section>
          <div style="background-color: #ffcc80">
            <div class="text-h6" v-if="this.descricaoDetalhesAtivo != ''">
              Descrição:
            </div>
            <div v-html="this.descricaoDetalhesAtivo"></div>
          </div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn style="margin: 2px" color="primary" @click="editarTarefas()">Editar</q-btn>
          <q-btn style="margin: 2px" color="primary" @click="dialogoDeletaTarefa(item)">Apagar</q-btn>
          <q-btn style="margin: 2px" color="primary" @click.stop="dialogoDetalhesAtivas = false">Voltar</q-btn>
        </q-card-section>

        <q-card-section></q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo exibe detalhes tarefas concluida -->
    <q-dialog v-model="dialogoDetalhesConcluidas" max-width="290" xs12 sm6 md6 lg6 xl6>
      <q-card class="text-center" style="background-color: #4fc3f7">
        <q-card-section>
          <div class="text-h6">Titulo:</div>
          <div style="background-color: #ffcc80" class="text-h6">{{ this.tituloDetalheConcluido }}</div>
        </q-card-section>
        <q-card-section> </q-card-section>

        <q-card-section>
          <div class="text-h6" v-if="this.descricaoDetalhesConcluido != ''">
            Descrição:
          </div>
          <div style="background-color: #ffcc80" v-html="this.descricaoDetalhesConcluido"></div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6" v-if="this.notasDetalhe != ''">
            Nota de Conclusão:
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6">{{ this.notasDetalhe }}</div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn style="margin: 2px" color="primary" @click="dialogoDeletaTarefaDetalhes()">Apagar</q-btn>
          <q-btn style="margin: 2px" color="primary" @click.stop="dialogoDetalhesConcluidas = false">Voltar</q-btn>
        </q-card-section>

        <q-card-section></q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo adiciona tarefa -->
    <q-dialog v-model="dialogoAddTarefa">
      <q-card class="text-center">
        <q-card-section>
          <div class="text-h6">Adicione uma Tarefa</div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input v-model="nomeDaTarefa" label="Informe o titulo da tarefa" required></q-input>
          </q-form>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <div class="text-h6">Descrição:</div>
            <q-editor v-model="descricaoTarefa" :toolbar="editorTools" :fonts="nomeDasFronts" />
          </q-form>
        </q-card-section>

        <q-card-section align="center">
          <q-btn flat color="primary" @click="criaTarefas">Salvar</q-btn>
          <q-btn flat color="primary" @click.stop="dialogoAddTarefa = false">Voltar</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo edita tarefa -->
    <q-dialog v-model="dialogoEditaTarefa">
      <q-card class="text-center">
        <q-card-section>
          <div class="text-h6">Editar Tarefa</div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input v-model="tituloEditar" label="Informe o titulo da tarefa" required></q-input>
          </q-form>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <div class="text-h6">Descrição:</div>
            <q-editor v-model="descriEditar" :toolbar="editorTools" :fonts="nomeDasFronts" />
          </q-form>
        </q-card-section>

        <q-card-section align="center">
          <q-btn flat color="primary" @click="atualizaTarefas()">Salvar</q-btn>
          <q-btn flat color="primary" @click.stop="dialogoEditaTarefa = false">Voltar</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo apagar tarefa ativa confirmação -->
    <q-dialog v-model="dialogoApagaTarefaAtiva">
      <q-card>
        <q-card-section>
          <div class="text-h6">Deseja realmente apagar esta tarefa?</div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">{{ this.tituloExclusao }}</div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn flat color="primary" @click="apagaTarefa">Sim</q-btn>
          <q-btn flat color="primary" @click.stop="dialogoApagaTarefaAtiva = false">Voltar</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo concluir tarefa ativa -->
    <q-dialog v-model="dialogoConcluirTarefa">
      <q-card>
        <q-card-section>
          <div class="text-h6">Deseja realmente concluir tarefa?</div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">{{ this.tituloTarefaConclusao }}</div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn flat color="primary" @click="concluiTarefa">Sim</q-btn>
          <q-btn flat color="primary" @click="dialogoConcluirTarefa = false">Voltar</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo restaurar tarefa -->
    <q-dialog v-model="dialogoRestaurarTarefa">
      <q-card>
        <q-card-section>
          <div class="text-h6">Deseja restaurar esta tarefa:</div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">"{{ this.tituloTarefaConclusao }}"?</div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn flat color="primary" @click="restauraTarefa()">Sim</q-btn>
          <q-btn flat color="primary" @click="dialogoRestaurarTarefa = false">Voltar</q-btn>
        </q-card-section>

        <q-card-section></q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo nota de conclusão -->
    <q-dialog v-model="dialogoAddNota">
      <q-card>
        <q-card-section>
          <div class="text-h6">Deseja adicionar alguma nota de conclusão?</div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">{{ this.tituloTarefaConclusao }}</div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input v-model="notaConclusao" label="Informe a nota de conclusão" required></q-input>
          </q-form>
        </q-card-section>

        <q-card-section align="center">
          <q-btn flat color="primary" @click="addNota()">Sim</q-btn>
          <q-btn flat color="primary" @click.stop="dialogoAddNota = false">Voltar</q-btn>
        </q-card-section>

        <q-card-section></q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import firebase from "firebase";
import { db, timestamp } from "../boot/main";
import { editorTools, nomeDasFronts } from "../boot/utils";

export default {
  props: ["idPasta", "idQuadro"],
  name: "Tarefas",
  data() {
    return {
      editorTools: editorTools,
      nomeDasFronts: nomeDasFronts,
      tab: "ativo",
      dialogoAddTarefa: false,
      dialogoDetalhesAtivas: false,
      dialogoConcluirTarefa: false,
      dialogoAddNota: false,
      dialogoRestaurarTarefa: false,
      dialogoEditaTarefa: false,
      dialogoApagaTarefaAtiva: false,
      tituloExclusao: "",
      tituloTarefaConclusao: "",

      pasta: null,
      quadro: null,

      tituloEditar: "",
      descriEditar: "",

      tituloDetalheAtivo: "",
      descricaoDetalhesAtivo: "",

      tituloDetalheConcluido: "",
      descricaoDetalhesConcluido: "",
      notasDetalhe: "",

      msg: "Tarefas Ativas",
      concluida: null,
      descricaoTarefa: "",
      idTarefa: "",
      nomeDaTarefa: "",
      notaConclusao: "",
      tarefaTimeStamp: "",
      dialogoDetalhesConcluidas: false,
      tarefasAtivaData: [],
      tarefasConcluidaData: []
    };
  },
  watch: {
    user: "init",
    refPasta: "carregaPastaAtual",
    refQuadro: "carregaQuadroAtual"
  },
  methods: {
    init() {
      if ((this.user.uid != null) & (this.refTarefas != null)) {
        this.carregaTarefasAtiva();
        this.carregaTarefasConcluidas();
        this.carregaQuadroAtual();
        this.carregaPastaAtual();
      }
    },
    carregaTarefasAtiva() {
      this.refTarefas
        .where("concluida", "==", false)
        .orderBy("tarefaTimeStamp", "asc")
        .onSnapshot(querySnapshot => {
          this.tarefasAtivaData = [];
          querySnapshot.forEach(doc => {
            this.tarefasAtivaData.push({
              idTarefa: doc.id,
              nomeDaTarefa: doc.data().nomeDaTarefa,
              descricaoTarefa: doc.data().descricaoTarefa,
              tarefaTimeStamp: doc.data().tarefaTimeStamp,
              concluida: doc.data().concluida,
              notaConclusao: doc.data().notaConclusao
            });
          });
        });
    },
    carregaTarefasConcluidas() {
      this.refTarefas
        .where("concluida", "==", true)
        .orderBy("tarefaTimeStamp", "asc")
        .onSnapshot(querySnapshot => {
          this.tarefasConcluidaData = [];
          querySnapshot.forEach(doc => {
            this.tarefasConcluidaData.push({
              idTarefa: doc.id,
              nomeDaTarefa: doc.data().nomeDaTarefa,
              descricaoTarefa: doc.data().descricaoTarefa,
              tarefaTimeStamp: doc.data().tarefaTimeStamp,
              concluida: doc.data().concluida,
              notaConclusao: doc.data().notaConclusao
            });
          });
        });
    },
    carregaQuadroAtual() {
      this.refQuadro
        .get()
        .then(resp => {
          this.quadro = resp.data();
        })
        .catch(err => {
          this.$notificacao(err, "red");
        });
    },
    carregaPastaAtual() {
      this.refPasta
        .get()
        .then(resp => {
          this.pasta = resp.data();
        })
        .catch(err => {
          this.$notificacao(err, "red");
        });
    },
    criaTarefas() {
      let a = this.nomeDaTarefa;
      let b = this.descricaoTarefa;
      if (a.includes("/") | b.includes("/")) {
        this.$notificacao("Caracteres '/' são proíbidos", "red");
        return;
      }
      if (a.includes("..") | b.includes("..")) {
        this.$notificacao("Caracteres '..' são proíbidos", "red");
        return;
      }
      if (a === "") {
        this.$notificacao("Erro, tarefa em branco", "red");
        return;
      }

      const conteudo = {
        nomeDaTarefa: this.nomeDaTarefa,
        idTarefa: this.idTarefa,
        descricaoTarefa: this.descricaoTarefa,
        notaConclusao: this.notaConclusao,
        tarefaTimeStamp: timestamp,
        concluida: false
      };
      db.collection("app")
        .doc(this.user.uid)
        .collection("Pasta")
        .doc(this.idPasta)
        .collection("Quadro")
        .doc(this.idQuadro)
        .collection("Tarefas")
        .add(conteudo)
        .then(ref => {
          const pushID = { idTarefa: ref.id };
          ref.update(pushID);
          this.$notificacao("Novo Quadro Adicionada", "green");
        })
        .catch(() => {
          this.$notificacao("objeto não adicionado", "red");
        });

      this.dialogoAddTarefa = false;
      this.nomeDaTarefa = "";
      this.descricaoTarefa = "";
    },
    exibeDetalhesAtiva(objeto) {
      this.dialogoDetalhesAtivas = true;
      this.idTarefa = objeto.idTarefa;
      this.tituloDetalheAtivo = objeto.nomeDaTarefa;
      this.descricaoDetalhesAtivo = objeto.descricaoTarefa;
    },
    exibeDetalhesConcluida(objeto) {
      this.dialogoDetalhesConcluidas = true;
      this.idTarefa = objeto.idTarefa;
      this.tituloDetalheConcluido = objeto.nomeDaTarefa;
      this.descricaoDetalhesConcluido = objeto.descricaoTarefa;
      this.notasDetalhe = objeto.notaConclusao;
    },
    apagaTarefa() {
      db.collection("app")
        .doc(this.user.uid)
        .collection("Pasta")
        .doc(this.idPasta)
        .collection("Quadro")
        .doc(this.idQuadro)
        .collection("Tarefas")
        .doc(this.idTarefa)
        .delete()
        .then(() => {
          this.$notificacao('Tarefa "' + this.tituloExclusao + '" foi apagada', "orange");
        })
        .catch(() => {
          this.$notificacao("Não foi possível excluir tarefa", "red");
        });
      if (this.dialogoDetalhesAtivas == true) {
        this.dialogoDetalhesAtivas = false;
      }
      if (this.dialogoDetalhesConcluidas == true) {
        this.dialogoDetalhesConcluidas = false;
      }
      if (this.dialogoApagaTarefaAtiva == true) {
        this.dialogoApagaTarefaAtiva = false;
      }
    },
    concluiTarefa() {
      const objeto = {
        concluida: true
      };
      db.collection("app")
        .doc(this.user.uid)
        .collection("Pasta")
        .doc(this.idPasta)
        .collection("Quadro")
        .doc(this.idQuadro)
        .collection("Tarefas")
        .doc(this.idTarefa)
        .update(objeto)
        .then(() => {
          this.$notificacao('Tarefa "' + this.tituloTarefaConclusao + '" foi concluída', "green");
        })
        .catch(() => {
          this.$notificacao("Não foi possível concluir tarefa", "red");
        });
      this.dialogoAddNota = true;
      this.dialogoConcluirTarefa = false;
    },
    addNota() {
      let a = this.notaConclusao;
      if (a.includes("/") | a.includes("..")) {
        //entrada para alerta
        return;
      }

      const objeto = {
        notaConclusao: this.notaConclusao
      };
      db.collection("app")
        .doc(this.user.uid)
        .collection("Pasta")
        .doc(this.idPasta)
        .collection("Quadro")
        .doc(this.idQuadro)
        .collection("Tarefas")
        .doc(this.idTarefa)
        .update(objeto)
        .then(() => {
          this.$notificacao('Nota "' + this.notaConclusao + '" foi adicionada', "green");
          this.notaConclusao = "";
        })
        .catch(() => {
          this.$notificacao("Não foi possível adicionar nota", "green");
        });
      this.dialogoAddNota = false;
    },
    restauraTarefa() {
      const objeto = {
        concluida: false,
        notaConclusao: ""
      };
      db.collection("app")
        .doc(this.user.uid)
        .collection("Pasta")
        .doc(this.idPasta)
        .collection("Quadro")
        .doc(this.idQuadro)
        .collection("Tarefas")
        .doc(this.idTarefa)
        .update(objeto)
        .then(() => {
          this.$notificacao('Tarefa "' + this.tituloTarefaConclusao + '" restaurada', "green");
        })
        .catch(() => {
          this.$notificacao("Não foi possível restaurar essa tarefa, tente novamente.", "green");
        });
      this.dialogoRestaurarTarefa = false;
      this.idTarefa = "";
      //this.tituloTarefaConclusao = "";
    },
    dialogoDeletaTarefa(item) {
      this.dialogoApagaTarefaAtiva = true;
      this.tituloExclusao = item.nomeDaTarefa;
      this.idTarefa = item.idTarefa;
    },
    dialogoDeletaTarefaDetalhes() {
      this.dialogoApagaTarefaAtiva = true;
      this.tituloExclusao = this.tituloDetalheConcluido;
    },
    exibeDialogoConcluirTarefa(item) {
      this.dialogoConcluirTarefa = true;
      this.tituloTarefaConclusao = item.nomeDaTarefa;
      this.idTarefa = item.idTarefa;
    },
    dialogoRestaurar(item) {
      this.dialogoRestaurarTarefa = true;
      this.tituloTarefaConclusao = item.nomeDaTarefa;
      this.idTarefa = item.idTarefa;
    },
    editarTarefas() {
      this.dialogoEditaTarefa = true;
      this.tituloEditar = this.tituloDetalheAtivo;
      this.descriEditar = this.descricaoDetalhesAtivo;
    },
    atualizaTarefas() {
      const conteudo = {
        nomeDaTarefa: this.tituloEditar,
        descricaoTarefa: this.descriEditar
      };

      db.collection("app")
        .doc(this.user.uid)
        .collection("Pasta")
        .doc(this.idPasta)
        .collection("Quadro")
        .doc(this.idQuadro)
        .collection("Tarefas")
        .doc(this.idTarefa)
        .update(conteudo)
        .then(ref => {
          this.$notificacao("Tarefa atualizada", "green");
        })
        .catch(() => {
          this.$notificacao("Problemas ao tentar atualizar tarefa", "red");
        });
      this.dialogoEditaTarefa = false;
      this.dialogoDetalhesAtivas = false;
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
          .doc(this.idQuadro);
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
    },
    refTarefas() {
      if (this.user.uid != null) {
        return firebase
          .firestore()
          .collection("app")
          .doc(this.user.uid)
          .collection("Pasta")
          .doc(this.idPasta)
          .collection("Quadro")
          .doc(this.idQuadro)
          .collection("Tarefas");
      } else {
        return null;
      }
    },
    nomePasta() {
      if (this.pasta != null) {
        if (this.pasta.nomeDaPasta != null) {
          return this.pasta.nomeDaPasta;
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
    nomeQuadro() {
      if (this.quadro != null) {
        if (this.quadro.nomeDoQuadro != null) {
          return this.quadro.nomeDoQuadro;
        }
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
<template>
  <div class="q-pa-md">
    <!-- flutuante -->
    <q-btn round color="orange darken-2" @click.stop="dialogoAddTarefa = true" class="fixed" style="right: 18px; bottom: 60px">
      <q-icon name="add" />
    </q-btn>
    <div class="text-h5 text-center">Tarefas</div>

    <!-- tabs -->
    <div style="max-width: 900px; margin: auto;">
      <div class="q-gutter-y-md">
        <q-card>
          <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
            <q-tab name="ativo" label="Ativas" />
            <q-tab name="concluido" label="Concluídas" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="ativo">
              <!-- Tab tarefas ativas -->
              <q-list bordered style="max-width: 900px; margin: auto;">
                <div class="text-h5 text-center">/{{ this.$store.getters.getNomeDaPasta }}/{{ this.$store.getters.getNomeDoQuadro }}/</div>

                <q-item clickable v-ripple v-for="item in tarefasAtivaData" :key="item.idTarefa" @click="exibeDetalhesAtiva(item)">
                  <q-item-section avatar top>
                    <q-avatar icon="event_note" color="primary" text-color="white" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label lines="1">{{ item.nomeDaTarefa }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-icon name="check" color="primary" @click.stop="dialogoConcluirTarefa(item)" />
                  </q-item-section>

                  <q-item-section side>
                    <q-icon name="delete_sweep" color="primary" @click.stop="dialogoDeletaTarefa(item)" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>

            <q-tab-panel name="concluido">
              <!-- Tab tarefas concluídas -->
              <q-list bordered style="max-width: 900px; margin: auto;">
                <div class="text-h5 text-center">/{{ this.$store.getters.getNomeDaPasta }}/{{ this.$store.getters.getNomeDoQuadro }}/</div>

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
                    <q-icon name="delete_sweep" color="primary" @click.stop="dialogoDeletaTarefa(item)" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>

    <!-- caixa de diálogo exibe detalhes tarefas ativas -->
    <q-dialog v-model="dialogoDetalhesAtivas" class="q-gutter-sm">
      <q-card class="text-center">
        <q-card-section>
          <div class="text-h6">Titulo:</div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">{{ this.tituloDetalheAtivo }}</div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6" v-if="this.descricaoDetalhesAtivo != ''">
            Descrição:
          </div>
        </q-card-section>

        <q-card-section>
          <div v-html="this.descricaoDetalhesAtivo"></div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn flat color="primary" @click="editarTarefas()">Editar</q-btn>
          <q-btn flat color="primary" @click="dialogoDeletaTarefa(item)">Apagar</q-btn>
          <q-btn flat color="primary" @click.stop="dialogoDetalhesAtivas = false">Voltar</q-btn>
        </q-card-section>

        <q-card-section></q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo exibe detalhes tarefas concluida -->
    <q-dialog v-model="dialogoDetalhesConcluidas" max-width="290" xs12 sm6 md6 lg6 xl6>
      <q-card class="text-center">
        <q-card-section>
          <div class="text-h6">Titulo:</div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6">{{ this.tituloDetalheConcluido }}</div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6" v-if="this.descricaoDetalhesConcluido != ''">
            Descrição:
          </div>
        </q-card-section>
        <q-card-section>
          <div v-html="this.descricaoDetalhesConcluido"></div>
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
          <q-btn flat color="primary" @click="dialogoDeletaTarefaDetalhes()">Apagar</q-btn>
          <q-btn flat color="primary" @click.stop="dialogoDetalhesConcluidas = false">Voltar</q-btn>
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
            <q-editor
              v-model="descricaoTarefa"
              :toolbar="[
                [
                  {
                    label: 'Alinhamentos',
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    list: 'only-icons',
                    options: ['left', 'center', 'right', 'justify']
                  },
                  {
                    label: 'Formatação 1',
                    icon: 'format_bold',
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'only-icons',
                    options: ['bold', 'italic', 'strike', 'underline']
                  }
                ],
                [
                  {
                    label: 'Paragrafo',
                    icon: $q.iconSet.editor.formatting,
                    list: 'no-icons',
                    options: paragrafos
                  },
                  {
                    label: 'Tamanho da Fonte',
                    icon: $q.iconSet.editor.fontSize,
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: tamanhoDaFonte
                  },
                  {
                    label: 'Fonte padrão',
                    icon: $q.iconSet.editor.font,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: fontes
                  },
                  'removeFormat'
                ],
                ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
                ['undo', 'redo']
              ]"
              :fonts="nomeDasFontes"
            />
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
            <q-editor
              v-model="descriEditar"
              :toolbar="[
                [
                  {
                    label: 'Alinhamentos',
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    list: 'only-icons',
                    options: ['left', 'center', 'right', 'justify']
                  },
                  {
                    label: 'Formatação 1',
                    icon: 'format_bold',
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'only-icons',
                    options: ['bold', 'italic', 'strike', 'underline']
                  }
                ],
                [
                  {
                    label: 'Paragrafo',
                    icon: $q.iconSet.editor.formatting,
                    list: 'no-icons',
                    options: paragrafos
                  },
                  {
                    label: 'Tamanho da Fonte',
                    icon: $q.iconSet.editor.fontSize,
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: tamanhoDaFonte
                  },
                  {
                    label: 'Fonte padrão',
                    icon: $q.iconSet.editor.font,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: fontes
                  },
                  'removeFormat'
                ],
                ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
                ['undo', 'redo']
              ]"
              :fonts="nomeDasFontes"
            />
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

export default {
  name: "Tarefas",
  data() {
    return {
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
      ref: firebase.firestore().collection("app"),
      refTarefasAtivas: firebase
        .firestore()
        .collection("app")
        .doc(this.$store.getters.getUser.uid)
        .collection("Pasta")
        .doc(this.$store.getters.getPushIDPasta)
        .collection("Quadro")
        .doc(this.$store.getters.getPushIDQuadro)
        .collection("Tarefas")
        .where("concluida", "==", false)
        .orderBy("tarefaTimeStamp", "asc"),
      refTarefasConcluida: firebase
        .firestore()
        .collection("app")
        .doc(this.$store.getters.getUser.uid)
        .collection("Pasta")
        .doc(this.$store.getters.getPushIDPasta)
        .collection("Quadro")
        .doc(this.$store.getters.getPushIDQuadro)
        .collection("Tarefas")
        .where("concluida", "==", true)
        .orderBy("tarefaTimeStamp", "asc"),
      tarefasAtivaData: [],
      tarefasConcluidaData: [],

      fontes: ["default_font", "arial", "arial_black", "comic_sans", "courier_new", "impact", "lucida_grande", "times_new_roman", "verdana"],
      nomeDasFontes: {
        arial: "Arial",
        arial_black: "Arial Black",
        comic_sans: "Comic Sans MS",
        courier_new: "Courier New",
        impact: "Impact",
        lucida_grande: "Lucida Grande",
        times_new_roman: "Times New Roman",
        verdana: "Verdana"
      },
      tamanhoDaFonte: ["size-1", "size-2", "size-3", "size-4", "size-5", "size-6", "size-7"],
      paragrafos: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "code"]
    };
  },

  methods: {
    criaTarefas() {
      let a = this.nomeDaTarefa;
      let b = this.descricaoTarefa;
      if (a.includes("/") | b.includes("/")) {
        this.$notificacao("Caracteres '/' são proíbidos", "red")
        return;
      }
      if (a.includes("..") | b.includes("..")) {
        this.$notificacao("Caracteres '..' são proíbidos", "red")
        return;
      }
      if (a === "") {
        this.$notificacao("Erro, tarefa em branco", "red")
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
        .doc(this.$store.getters.getUser.uid)
        .collection("Pasta")
        .doc(this.$store.getters.getPushIDPasta)
        .collection("Quadro")
        .doc(this.$store.getters.getPushIDQuadro)
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
    carregaTarefasAtiva() {
      this.refTarefasAtivas.onSnapshot(querySnapshot => {
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
      this.refTarefasConcluida.onSnapshot(querySnapshot => {
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
        .doc(this.$store.getters.getUser.uid)
        .collection("Pasta")
        .doc(this.$store.getters.getPushIDPasta)
        .collection("Quadro")
        .doc(this.$store.getters.getPushIDQuadro)
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
        .doc(this.$store.getters.getUser.uid)
        .collection("Pasta")
        .doc(this.$store.getters.getPushIDPasta)
        .collection("Quadro")
        .doc(this.$store.getters.getPushIDQuadro)
        .collection("Tarefas")
        .doc(this.idTarefa)
        .update(objeto)
        .then(() => {
          this.$notificacao('Tarefa "' + this.tituloTarefaConclusao + '" foi concluída', "green")
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
        .doc(this.$store.getters.getUser.uid)
        .collection("Pasta")
        .doc(this.$store.getters.getPushIDPasta)
        .collection("Quadro")
        .doc(this.$store.getters.getPushIDQuadro)
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
        .doc(this.$store.getters.getUser.uid)
        .collection("Pasta")
        .doc(this.$store.getters.getPushIDPasta)
        .collection("Quadro")
        .doc(this.$store.getters.getPushIDQuadro)
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
    dialogoConcluirTarefa(item) {
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
        .doc(this.$store.getters.getUser.uid)
        .collection("Pasta")
        .doc(this.$store.getters.getPushIDPasta)
        .collection("Quadro")
        .doc(this.$store.getters.getPushIDQuadro)
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
  created() {
    this.setUser();
    this.carregaTarefasAtiva();
    this.carregaTarefasConcluidas();
  },
  computed: {
    user() {
      if (this.$store.getters.getUser != null) {
        return this.$store.getters.getUser;
      } else {
        return { uid: null, email: null };
      }
    },
  },
};
</script>

<style scoped>
form > * {
  display: block;
}
</style>
<template>
  <div class="q-pa-none">
    <!-- flutuante -->
    <q-btn
      v-if="$q.platform.is.mobile"
      round
      color="orange darken-2"
      class="fixed fabLeft"
      @click.stop="$router.go(-1)"
    >
      <q-icon name="fas fa-arrow-left" />
    </q-btn>
    <q-btn
      v-if="$q.platform.is.desktop"
      round
      color="orange darken-2"
      class="fixed fabBack"
      @click.stop="$router.go(-1)"
    >
      <q-icon name="fas fa-arrow-left" />
    </q-btn>

    <q-btn
      v-if="$q.platform.is.mobile"
      round
      color="orange darken-2"
      class="fixed fabRight"
      @click.stop="(dialogoAddTarefa = true), resetForm()"
    >
      <q-icon name="add" />
    </q-btn>
    <q-btn
      v-if="$q.platform.is.desktop"
      round
      color="orange darken-2"
      class="fixed fabCenter"
      @click.stop="(dialogoAddTarefa = true), resetForm()"
    >
      <q-icon
        class="iconFabCenter"
        name="add"
      />
    </q-btn>
    <div class="text-h5 text-center">
      Tarefas
    </div>

    <!-- tabs -->
    <div class="divPrincipal">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab
            v-if="listTasksActive.length > 0"
            name="ativo"
            label="Ativas"
          />
          <q-tab
            v-if="listTaskFinish.length > 0"
            name="concluido"
            label="Concluídas"
          />
        </q-tabs>

        <q-separator />

        <q-tab-panels
          v-model="tab"
          animated
        >
          <q-tab-panel
            name="ativo"
            style="padding: 0px"
          >
            <!-- Tab tarefas ativas -->
            <q-list
              bordered
              style="max-width: 900px; margin: auto;"
            >
              <q-item
                v-for="item in listTasksActive"
                :key="item.idTarefa"
                v-ripple
                clickable
                @click="showActivityTasks(item)"
              >
                <q-item-section
                  avatar
                  top
                >
                  <q-avatar
                    icon="event_note"
                    color="primary"
                    text-color="white"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">
                    {{ item.nomeDaTarefa }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon
                    name="check"
                    color="primary"
                    @click.stop="showDialogFinishTasks(item)"
                  />
                </q-item-section>

                <q-item-section side>
                  <q-icon
                    name="delete_sweep"
                    color="grey ligten-1"
                    @click.stop="showdialogTasksDelete(item)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>

          <q-tab-panel
            name="concluido"
            style="padding: 0px"
          >
            <!-- Tab tarefas concluídas -->
            <q-list
              bordered
              style="max-width: 900px; margin: auto;"
            >
              <q-item
                v-for="item in listTaskFinish"
                :key="item.idTarefa"
                v-ripple
                clickable
                @click="showFinishedActivities(item)"
              >
                <q-item-section
                  avatar
                  top
                >
                  <q-avatar
                    icon="event_note"
                    color="primary"
                    text-color="white"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1">
                    {{ item.nomeDaTarefa }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon
                    name="restore"
                    color="primary"
                    @click.stop="dialogRestore(item)"
                  />
                </q-item-section>

                <q-item-section side>
                  <q-icon
                    name="delete_sweep"
                    color="grey ligten-1"
                    @click.stop="showdialogTasksDelete(item)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>

    <!-- caixa de diálogo exibe detalhes tarefas ativas -->
    <q-dialog v-model="dialogShowActivityTasks">
      <q-card class="text-center backgroundCardColor">
        <q-card-section>
          <div class="q-pa-xs backgroundTextoPopup">
            <div class="text-h6">
              {{ formTaskActive.nomeDaTarefa }}
            </div>
          </div>
        </q-card-section>

        <q-card-section />

        <q-card-section v-if="formTaskActive.descricaoTarefa != ''">
          <div class="q-pa-xs backgroundTextoPopup">
            <div v-html="formTaskActive.descricaoTarefa" />
          </div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click.stop="dialogShowActivityTasks = false"
          >
            Voltar
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="red"
            @click="dialogDeleteTasks = true"
          >
            Apagar
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="dialogTasksEdit = true"
          >
            Editar
          </q-btn>
        </q-card-section>

        <q-card-section />
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo exibe detalhes tarefas concluida -->
    <q-dialog v-model="dialogShowFinishedActivities">
      <q-card class="text-center backgroundCardColor">
        <q-card-section>
          <div class="text-h6 q-pa-xs backgroundTextoPopup">
            {{ formTaskFinish.nomeDaTarefa }}
          </div>
        </q-card-section>
        <q-card-section />

        <q-card-section v-if="formTaskFinish.descricaoTarefa != null">
          <div
            class="text-h6 q-pa-xs backgroundTextoPopup"
            v-html="formTaskFinish.descricaoTarefa"
          />
        </q-card-section>

        <q-card-section v-if="formTaskFinish.notaConclusao != null">
          <div class="text-h6">
            Nota de Conclusão:
          </div>
          <div class="text-h6">
            {{ formTaskFinish.notaConclusao }}
          </div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click.stop="dialogShowFinishedActivities = false"
          >
            Voltar
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="red"
            @click="dialogDeleteTasks = true"
          >
            Apagar
          </q-btn>
        </q-card-section>

        <q-card-section />
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo adiciona tarefa -->
    <q-dialog v-model="dialogoAddTarefa">
      <q-card class="text-center">
        <q-card-section>
          <div class="text-h6">
            Adicione uma Tarefa
          </div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              v-model="formTaskActive.nomeDaTarefa"
              label="Informe o titulo da tarefa"
              required
            />
          </q-form>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <div class="text-h6">
              Descrição:
            </div>
            <q-editor
              v-model="formTaskActive.descricaoTarefa"
              :toolbar="editorTools"
              :fonts="nomeDasFronts"
            />
          </q-form>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click.stop="dialogoAddTarefa = false"
          >
            Voltar
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="createTasks"
          >
            Salvar
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo edita tarefa -->
    <q-dialog v-model="dialogTasksEdit">
      <q-card class="text-center">
        <q-card-section>
          <div class="text-h6">
            Editar Tarefa
          </div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              v-model="formTaskActive.nomeDaTarefa"
              label="Informe o titulo da tarefa"
              required
            />
          </q-form>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <div class="text-h6">
              Descrição:
            </div>
            <q-editor
              v-model="formTaskActive.descricaoTarefa"
              :toolbar="editorTools"
              :fonts="nomeDasFronts"
            />
          </q-form>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click.stop="dialogTasksEdit = false"
          >
            Voltar
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="updateTasks()"
          >
            Salvar
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo apagar tarefa ativa confirmação -->
    <q-dialog v-model="dialogDeleteTasks">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Deseja realmente apagar esta tarefa?
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">
            {{ formTaskActive.nomeDaTarefa }}
          </div>
          <div class="text-h6">
            {{ formTaskFinish.nomeDaTarefa }}
          </div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click.stop="dialogDeleteTasks = false"
          >
            Voltar
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="red"
            @click="deleteTasks()"
          >
            Sim
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo concluir tarefa ativa -->
    <q-dialog v-model="dialogoConcluirTarefa">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Deseja realmente concluir tarefa?
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">
            {{ formTaskActive.nomeDaTarefa }}
          </div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click="dialogoConcluirTarefa = false"
          >
            Voltar
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="finishTasks"
          >
            Sim
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo restaurar tarefa -->
    <q-dialog v-model="dialogRestoreTasks">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Deseja restaurar esta tarefa:
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">
            "{{ formTaskFinish.nomeDaTarefa }}"?
          </div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click="dialogRestoreTasks = false"
          >
            Voltar
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="restoreTasks()"
          >
            Sim
          </q-btn>
        </q-card-section>

        <q-card-section />
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo nota de conclusão -->
    <q-dialog v-model="dialogoAddNota">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Deseja adicionar alguma nota de conclusão?
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">
            {{ formTaskActive.nomeDaTarefa }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              v-model="formTaskActive.notaConclusao"
              label="Informe a nota de conclusão"
              required
            />
          </q-form>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click.stop="dialogoAddNota = false"
          >
            Voltar
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="addNota()"
          >
            Sim
          </q-btn>
        </q-card-section>

        <q-card-section />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import firebase from 'firebase'
import { timestamp } from '../boot/main'
import { editorTools, nomeDasFronts } from '../boot/utils'

export default {
  name: 'Tarefas',
  props: ['idPasta', 'idQuadro'],
  data () {
    return {
      editorTools: editorTools,
      nomeDasFronts: nomeDasFronts,
      tab: 'ativo',
      dialogoAddTarefa: false,
      dialogShowActivityTasks: false,
      dialogoConcluirTarefa: false,
      dialogoAddNota: false,
      dialogRestoreTasks: false,
      dialogTasksEdit: false,
      dialogDeleteTasks: false,

      formTaskActive: {
        idTarefa: null,
        concluida: null,
        descricaoTarefa: '',
        nomeDaTarefa: null,
        notaConclusao: null,
        tarefaTimeStamp: null
      },

      formTaskFinish: {
        idTarefa: null,
        concluida: null,
        descricaoTarefa: '',
        nomeDaTarefa: null,
        notaConclusao: null,
        tarefaTimeStamp: null
      },
      msg: 'Tarefas Ativas',
      dialogShowFinishedActivities: false,
      listTasksActive: [],
      listTaskFinish: []
    }
  },
  computed: {
    user () {
      if (this.$store.getters.getUser != null) {
        return this.$store.getters.getUser
      } else {
        return { uid: null, email: null }
      }
    },
    refQuadro () {
      if (this.user.uid != null) {
        return firebase
          .firestore()
          .collection('app')
          .doc(this.user.uid)
          .collection('Pasta')
          .doc(this.idPasta)
          .collection('Quadro')
          .doc(this.idQuadro)
      } else {
        return null
      }
    },
    refPasta () {
      if (this.user.uid != null) {
        return firebase
          .firestore()
          .collection('app')
          .doc(this.user.uid)
          .collection('Pasta')
          .doc(this.idPasta)
      } else {
        return null
      }
    },
    refTarefas () {
      if (this.user.uid != null) {
        return firebase
          .firestore()
          .collection('app')
          .doc(this.user.uid)
          .collection('Pasta')
          .doc(this.idPasta)
          .collection('Quadro')
          .doc(this.idQuadro)
          .collection('Tarefas')
      } else {
        return null
      }
    }
  },
  watch: {
    user: 'init',
    refPasta: 'loadingPastaTitle',
    refQuadro: 'loadingQuadroTitle'
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if ((this.user.uid != null) & (this.refTarefas != null)) {
        this.loadingQuadroTitle()
        this.loadingPastaTitle()
        this.loadingTasksActive()
        this.loadingTasksFinsh()
      }
    },
    loadingTasksActive () {
      this.refTarefas
        .where('concluida', '==', false)
        .orderBy('tarefaTimeStamp', 'asc')
        .onSnapshot(querySnapshot => {
          this.listTasksActive = []
          querySnapshot.forEach(doc => {
            this.listTasksActive.push(doc.data())
          })
        })
    },
    loadingTasksFinsh () {
      this.refTarefas
        .where('concluida', '==', true)
        .orderBy('tarefaTimeStamp', 'asc')
        .onSnapshot(querySnapshot => {
          this.listTaskFinish = []
          querySnapshot.forEach(doc => {
            this.listTaskFinish.push(doc.data())
          })
        })
    },
    loadingQuadroTitle () {
      this.refQuadro
        .get()
        .then(resp => {
          this.$store.dispatch('defineQuadroAtual', resp.data())
        })
        .catch(err => {
          this.$notifiy(err, 'red')
        })
    },
    loadingPastaTitle () {
      this.refPasta
        .get()
        .then(resp => {
          this.$store.dispatch('definePastaAtual', resp.data())
        })
        .catch(err => {
          this.$notifiy(err, 'red')
        })
    },
    createTasks () {
      this.formTaskActive.concluida = false
      const content = this.formTaskActive

      this.refTarefas
        .add(content)
        .then(ref => {
          const pushID = {
            idTarefa: ref.id,
            tarefaTimeStamp: timestamp
          }
          ref.update(pushID)
          this.$notifiy('Novo Quadro Adicionada', 'green')
        })
        .catch(() => {
          this.$notifiy('objeto não adicionado', 'red')
        })

      this.dialogoAddTarefa = false
    },
    showActivityTasks (obj) {
      this.resetForm()
      this.dialogShowActivityTasks = true
      this.formTaskActive = obj
    },
    showFinishedActivities (obj) {
      this.resetForm()
      this.dialogShowFinishedActivities = true
      this.formTaskFinish = obj
    },
    finishTasks () {
      this.refTarefas
        .doc(this.formTaskActive.idTarefa)
        .update({ concluida: true })
        .then(() => {
          this.$notifiy('Tarefa foi concluída', 'green')
        })
        .catch(() => {
          this.$notifiy('Não foi possível concluir tarefa', 'red')
        })
      this.dialogoAddNota = true
      this.dialogoConcluirTarefa = false
    },
    addNota () {
      this.refTarefas
        .doc(this.formTaskActive.idTarefa)
        .update({ notaConclusao: this.formTaskActive.notaConclusao })
        .then(() => {
          this.$notifiy('Nota "' + this.formTaskActive.notaConclusao + '" foi adicionada', 'green')
        })
        .catch(() => {
          this.$notifiy('Não foi possível adicionar nota', 'green')
        })
      this.dialogoAddNota = false
    },

    showdialogTasksDelete (item) {
      this.resetForm()
      this.dialogDeleteTasks = true

      if (item.concluida === false) {
        this.formTaskActive = item
      }
      if (item.concluida === true) {
        this.formTaskFinish = item
      }
    },
    deleteTasks () {
      if (this.formTaskActive.concluida === false) {
        this.refTarefas
          .doc(this.formTaskActive.idTarefa)
          .delete()
          .then(() => {
            this.$notifiy('Tarefa foi apagada', 'green')
          })
          .catch(() => {
            this.$notifiy('Não foi possível excluir tarefa', 'red')
          })
      }
      if (this.formTaskFinish.concluida === true) {
        this.refTarefas
          .doc(this.formTaskFinish.idTarefa)
          .delete()
          .then(() => {
            this.$notifiy('Tarefa foi apagada', 'green')
          })
          .catch(() => {
            this.$notifiy('Não foi possível excluir tarefa', 'red')
          })
      }

      if (this.dialogShowActivityTasks === true) {
        this.dialogShowActivityTasks = false
      }
      if (this.dialogShowFinishedActivities === true) {
        this.dialogShowFinishedActivities = false
      }
      if (this.dialogDeleteTasks === true) {
        this.dialogDeleteTasks = false
      }
    },
    showDialogFinishTasks (item) {
      this.dialogoConcluirTarefa = true
      this.formTaskActive = item
    },

    dialogRestore (item) {
      this.dialogRestoreTasks = true
      this.formTaskFinish = item
    },
    restoreTasks () {
      this.refTarefas
        .doc(this.formTaskFinish.idTarefa)
        .update({ concluida: false, notaConclusao: '' })
        .then(() => {
          this.$notifiy('Tarefa restaurada', 'green')
        })
        .catch(() => {
          this.$notifiy('Não foi possível restaurar essa tarefa, tente novamente.', 'green')
        })
      this.dialogRestoreTasks = false
    },

    updateTasks () {
      this.refTarefas
        .doc(this.formTaskActive.idTarefa)
        .update(this.formTaskActive)
        .then(ref => {
          this.$notifiy('Tarefa atualizada', 'green')
        })
        .catch(() => {
          this.$notifiy('Problemas ao tentar atualizar tarefa', 'red')
        })
      this.dialogTasksEdit = false
      this.dialogShowActivityTasks = false
    },

    resetForm () {
      this.formTaskActive = {
        idTarefa: null,
        concluida: null,
        descricaoTarefa: '',
        nomeDaTarefa: null,
        notaConclusao: null,
        tarefaTimeStamp: null
      }

      this.formTaskFinish = {
        idTarefa: null,
        concluida: null,
        descricaoTarefa: '',
        nomeDaTarefa: null,
        notaConclusao: null,
        tarefaTimeStamp: null
      }
    }
  }
}
</script>

<style scoped>
</style>

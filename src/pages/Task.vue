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
      {{ $t('task.title') }}
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
                :key="item.id"
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
                    {{ item.title }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon
                    name="check"
                    color="primary"
                    @click.stop="showFinishTask(item)"
                  />
                </q-item-section>

                <q-item-section side>
                  <q-icon
                    name="delete_sweep"
                    color="grey ligten-1"
                    @click.stop="showTaskDelete(item)"
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
                :key="item.id"
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
                    {{ item.title }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon
                    name="restore"
                    color="primary"
                    @click.stop="showRestoreTask(item)"
                  />
                </q-item-section>

                <q-item-section side>
                  <q-icon
                    name="delete_sweep"
                    color="grey ligten-1"
                    @click.stop="showTaskDelete(item)"
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
              {{ formTaskActive.title }}
            </div>
          </div>
        </q-card-section>

        <q-card-section />

        <q-card-section v-if="formTaskActive.content != ''">
          <div class="q-pa-xs backgroundTextoPopup">
            <div v-html="formTaskActive.content" />
          </div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click.stop="dialogShowActivityTasks = false"
          >
            {{ $t('geral.back') }}
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="red"
            @click="dialogDeleteTasks = true"
          >
            {{ $t('geral.delete') }}
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="dialogTasksEdit = true"
          >
            {{ $t('geral.edit') }}
          </q-btn>
        </q-card-section>

        <q-card-section />
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo exibe detalhes tarefas finished -->
    <q-dialog v-model="dialogShowFinishedActivities">
      <q-card class="text-center backgroundCardColor">
        <q-card-section>
          <div class="text-h6 q-pa-xs backgroundTextoPopup">
            {{ formTaskFinish.title }}
          </div>
        </q-card-section>
        <q-card-section />

        <q-card-section v-if="formTaskFinish.content != null">
          <div
            class="text-h6 q-pa-xs backgroundTextoPopup"
            v-html="formTaskFinish.content"
          />
        </q-card-section>

        <q-card-section v-if="formTaskFinish.finishNotes != null">
          <div class="text-h6">
            {{ $t('dialogs.finishTaskNoteTitle') }}
          </div>
          <div class="text-h6">
            {{ formTaskFinish.finishNotes }}
          </div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click.stop="dialogShowFinishedActivities = false"
          >
            {{ $t('geral.back') }}
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="red"
            @click="dialogDeleteTasks = true"
          >
            {{ $t('geral.delete') }}
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
            {{ $t('dialogs.addNewTask') }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              v-model="formTaskActive.title"
              label="Informe o titulo da tarefa"
              required
            />
          </q-form>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <div class="text-h6">
              {{ $t('dialogs.description') }}
            </div>
            <q-editor
              v-model="formTaskActive.content"
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
            {{ $t('geral.back') }}
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="storeTask"
          >
            {{ $t('geral.save') }}
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo edita tarefa -->
    <q-dialog v-model="dialogTasksEdit">
      <q-card class="text-center">
        <q-card-section>
          <div class="text-h6">
            {{ $t('dialogs.editTask') }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              v-model="formTaskActive.title"
              label="Informe o titulo da tarefa"
              required
            />
          </q-form>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <div class="text-h6">
              {{ $t('dialogs.description') }}
            </div>
            <q-editor
              v-model="formTaskActive.content"
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
            {{ $t('geral.back') }}
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="updateTasks()"
          >
            {{ $t('geral.save') }}
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo apagar tarefa ativa confirmação -->
    <q-dialog v-model="dialogDeleteTasks">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            {{ $t('dialogs.questionDelete') }}
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">
            {{ formTaskActive.title }}
          </div>
          <div class="text-h6">
            {{ formTaskFinish.title }}
          </div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click.stop="dialogDeleteTasks = false"
          >
            {{ $t('geral.back') }}
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="red"
            @click="destroyTask()"
          >
            {{ $t('geral.yes') }}
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo concluir tarefa ativa -->
    <q-dialog v-model="dialogoConcluirTarefa">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            {{ $t('dialogs.finishTaskNoteTitle') }}
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">
            {{ formTaskActive.title }}
          </div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click="dialogoConcluirTarefa = false"
          >
            {{ $t('geral.back') }}
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="finishTasks"
          >
            {{ $t('geral.yes') }}
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo restaurar tarefa -->
    <q-dialog v-model="dialogRestoreTasks">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            {{ $t('dialogs.questionRestore') }}
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">
            "{{ formTaskFinish.title }}"?
          </div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click="dialogRestoreTasks = false"
          >
            {{ $t('geral.back') }}
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="restoreTasks()"
          >
            {{ $t('geral.yes') }}
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
            {{ $t('dialogs.questionForAddNotes') }}
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">
            {{ formTaskActive.title }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              v-model="formTaskActive.finishNotes"
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
            {{ $t('geral.back') }}
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="addFinishNotes()"
          >
            {{ $t('geral.yes') }}
          </q-btn>
        </q-card-section>

        <q-card-section />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { editorTools, nomeDasFronts } from '../boot/utils'

export default {
  name: 'Task',
  props: {
    idFolder: {
      type: String,
      default: ''
    },
    idBoard: {
      type: String,
      default: ''
    }
  },
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
        id: null,
        finished: '',
        content: '',
        title: '',
        finishNotes: '',
        createdAt: '',
        updatedAt: ''
      },

      formTaskFinish: {
        id: null,
        finished: '',
        content: '',
        title: '',
        finishNotes: '',
        createdAt: '',
        updatedAt: ''
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
        return this.$firebase
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
        return this.$firebase
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
        return this.$firebase
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
    refPasta: 'getCurrentFolder',
    refQuadro: 'getCurrentBoard'
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if ((this.user.uid != null) & (this.refTarefas != null)) {
        this.getCurrentBoard()
        this.getCurrentFolder()
        this.indexTaskActive()
        this.indexTaskFinish()
      }
    },
    indexTaskActive () {
      this.refTarefas
        .where('finished', '==', false)
        .orderBy('createdAt', 'asc')
        .onSnapshot(querySnapshot => {
          this.listTasksActive = []
          querySnapshot.forEach(doc => {
            this.listTasksActive.push(doc.data())
          })
        })
    },
    indexTaskFinish () {
      this.refTarefas
        .where('finished', '==', true)
        .orderBy('createdAt', 'asc')
        .onSnapshot(querySnapshot => {
          this.listTaskFinish = []
          querySnapshot.forEach(doc => {
            this.listTaskFinish.push(doc.data())
          })
        })
    },
    getCurrentBoard () {
      this.refQuadro
        .get()
        .then(resp => {
          this.$store.dispatch('setCurrentBoard', resp.data())
        })
        .catch(err => {
          this.$notifiy(err, 'red')
        })
    },
    getCurrentFolder () {
      this.refPasta
        .get()
        .then(resp => {
          this.$store.dispatch('setCurrentFolder', resp.data())
        })
        .catch(err => {
          this.$notifiy(err, 'red')
        })
    },
    storeTask () {
      this.formTaskActive.finished = false
      const content = this.formTaskActive

      this.refTarefas
        .add(content)
        .then(ref => {
          const pushID = {
            id: ref.id,
            createdAt: this.$timestamp
          }
          ref.update(pushID)
          this.$notifiy(this.$t('alert.sucess.addedTask'), 'green')
        })
        .catch(() => {
          this.$notifiy(this.$t('alert.error.errorTryingToAdd'), 'green')
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
        .doc(this.formTaskActive.id)
        .update({ finished: true })
        .then(() => {
          this.$notifiy(this.$t('alert.sucess.finishTask'), 'green')
        })
        .catch(() => {
          this.$notifiy(this.$t('alert.error.errorTryingToFinish'), 'green')
        })
      this.dialogoAddNota = true
      this.dialogoConcluirTarefa = false
    },
    addFinishNotes () {
      this.refTarefas
        .doc(this.formTaskActive.id)
        .update({ finishNotes: this.formTaskActive.finishNotes })
        .then(() => {
          this.$notifiy(this.$t('alert.sucess.addedTask'), 'green')
        })
        .catch(() => {
          this.$notifiy(this.$t('alert.error.errorTryingToAdd'), 'green')
        })
      this.dialogoAddNota = false
    },

    showTaskDelete (item) {
      this.resetForm()
      this.dialogDeleteTasks = true

      if (item.finished === false) {
        this.formTaskActive = item
      }
      if (item.finished === true) {
        this.formTaskFinish = item
      }
    },
    destroyTask () {
      if (this.formTaskActive.finished === false) {
        this.refTarefas
          .doc(this.formTaskActive.id)
          .delete()
          .then(() => {
            this.$notifiy(this.$t('alert.sucess.removedTask'), 'green')
          })
          .catch(() => {
            this.$notifiy(this.$t('alert.error.errorTryingToRemove'), 'green')
          })
      }
      if (this.formTaskFinish.finished === true) {
        this.refTarefas
          .doc(this.formTaskFinish.id)
          .delete()
          .then(() => {
            this.$notifiy(this.$t('alert.sucess.removedTask'), 'green')
          })
          .catch(() => {
            this.$notifiy(this.$t('alert.error.errorTryingToRemove'), 'green')
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
    showFinishTask (item) {
      this.dialogoConcluirTarefa = true
      this.formTaskActive = item
    },

    showRestoreTask (item) {
      this.dialogRestoreTasks = true
      this.formTaskFinish = item
    },
    restoreTasks () {
      this.refTarefas
        .doc(this.formTaskFinish.id)
        .update({ finished: false, finishNotes: '' })
        .then(() => {
          this.$notifiy(this.$t('alert.sucess.restoreTask'), 'green')
        })
        .catch(() => {
          this.$notifiy(this.$t('alert.error.errorTryingToRestore'), 'green')
        })
      this.dialogRestoreTasks = false
    },

    updateTasks () {
      this.refTarefas
        .doc(this.formTaskActive.id)
        .update(this.formTaskActive)
        .then(ref => {
          this.$notifiy(this.$t('alert.sucess.updatedTask'), 'green')
        })
        .catch(() => {
          this.$notifiy(this.$t('alert.error.errorTryingToUpdated'), 'red')
        })
      this.dialogTasksEdit = false
      this.dialogShowActivityTasks = false
    },

    resetForm () {
      this.formTaskActive = {
        id: null,
        finished: null,
        content: '',
        title: null,
        finishNotes: null,
        createdAt: null
      }

      this.formTaskFinish = {
        id: null,
        finished: null,
        content: '',
        title: null,
        finishNotes: null,
        createdAt: null
      }
    }
  }
}
</script>

<style scoped>
</style>

<template>
  <div class="q-pa-none">
    <FabBtnBackPageMobile
      @eventClick="$router.go(-1)"
    />

    <FabBtnAddMobile
      @eventClick="(dialogoAddTarefa = true), resetForm()"
    />

    <FabBtnBackPageDesktop
      @eventClick="$router.go(-1)"
    />

    <FabBtnAddDesktop
      @eventClick="(dialogoAddTarefa = true), resetForm()"
    />

    <div class="text-h5 text-center">
      {{ $t('task.title') }}
    </div>

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

    <DialogViewActivityTask
      :form="formTaskActive"
      :dialog="dialogShowActivityTasks"
      @eventClose="dialogShowActivityTasks = false"
      @eventEdit="dialogTasksEdit = true"
      @eventDelete="dialogDeleteTasks = true"
    />

    <DialogViewFinishedTask
      :form="formTaskFinish"
      :dialog="dialogShowFinishedActivities"
      @eventClose="dialogShowFinishedActivities = false"
      @eventDelete="dialogDeleteTasks = true"
    />

    <DialogAddTask
      :dialog="dialogoAddTarefa"
      @eventClose="dialogoAddTarefa = false"
      @eventSave="storeTask($event)"
    />

    <DialogEditTask
      :dialog="dialogTasksEdit"
      :form="formTaskActive"
      @eventClose="dialogTasksEdit = false"
      @eventSave="updateTasks($event)"
    />

    <!-- Dialog Delete -->
    <DialogConfirm
      :dialog="dialogDeleteTasks"
      :question="$t('dialogs.questionDelete')"
      :title="formTaskActive.title || formTaskFinish.title"
      :color="'red'"
      @eventClose="dialogDeleteTasks = false"
      @eventConfirm="destroyTask()"
    />

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
import FabBtnAddDesktop from '../components/button/FabAddDesktop'
import FabBtnAddMobile from '../components/button/FabAddMobile'
import FabBtnBackPageMobile from '../components/button/FabBackPageMobile'
import FabBtnBackPageDesktop from '../components/button/FabBackPageDesktop'
import DialogViewActivityTask from '../components/dialogs/DialogViewActivityTask'
import DialogViewFinishedTask from '../components/dialogs/DialogViewFinishedTask'
import DialogAddTask from '../components/dialogs/DialogAddTask'
import DialogEditTask from '../components/dialogs/DialogEditTask'
export default {
  name: 'Task',
  components: {
    FabBtnAddDesktop,
    FabBtnAddMobile,
    FabBtnBackPageMobile,
    FabBtnBackPageDesktop,
    DialogViewActivityTask,
    DialogViewFinishedTask,
    DialogAddTask,
    DialogEditTask
  },
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
    refBoard () {
      if (this.user.uid != null) {
        return this.$firebase
          .firestore()
          .collection('app')
          .doc(this.user.uid)
          .collection('folder')
          .doc(this.idFolder)
          .collection('board')
          .doc(this.idBoard)
      } else {
        return null
      }
    },
    refFolder () {
      if (this.user.uid != null) {
        return this.$firebase
          .firestore()
          .collection('app')
          .doc(this.user.uid)
          .collection('folder')
          .doc(this.idFolder)
      } else {
        return null
      }
    },
    refTasks () {
      if (this.user.uid != null) {
        return this.$firebase
          .firestore()
          .collection('app')
          .doc(this.user.uid)
          .collection('folder')
          .doc(this.idFolder)
          .collection('board')
          .doc(this.idBoard)
          .collection('task')
      } else {
        return null
      }
    }
  },
  watch: {
    user: 'init',
    refFolder: 'getCurrentFolder',
    refBoard: 'getCurrentBoard'
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if ((this.user.uid != null) & (this.refTasks != null)) {
        this.getCurrentBoard()
        this.getCurrentFolder()
        this.indexTaskActive()
        this.indexTaskFinish()
      }
    },
    indexTaskActive () {
      this.refTasks
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
      this.refTasks
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
      this.refBoard
        .get()
        .then(resp => {
          this.$store.dispatch('setCurrentBoard', resp.data())
        })
        .catch(err => {
          this.$notifiy(err, 'red')
        })
    },
    getCurrentFolder () {
      this.refFolder
        .get()
        .then(resp => {
          this.$store.dispatch('setCurrentFolder', resp.data())
        })
        .catch(err => {
          this.$notifiy(err, 'red')
        })
    },
    storeTask (form) {
      this.formTaskActive = form

      this.refTasks
        .add(this.formTaskActive)
        .then(ref => {
          const pushID = {
            id: ref.id,
            createdAt: this.$timestamp,
            updatedAt: this.$timestamp
          }
          ref.update(pushID)
          this.$notifiy(this.$t('alert.sucess.addedTask'), 'green')
        })
        .catch(() => {
          this.$notifiy(this.$t('alert.error.errorTryingToAdd'), 'green')
        })
      this.resetForm()
      this.dialogoAddTarefa = false
    },
    showActivityTasks (task) {
      this.resetForm()
      this.dialogShowActivityTasks = true
      this.formTaskActive = task
    },
    showFinishedActivities (obj) {
      this.resetForm()
      this.dialogShowFinishedActivities = true
      this.formTaskFinish = obj
    },
    finishTasks () {
      this.refTasks
        .doc(this.formTaskActive.id)
        .update({ finished: true, updatedAt: this.$timestamp })
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
      this.refTasks
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
        this.refTasks
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
        this.refTasks
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
      this.refTasks
        .doc(this.formTaskFinish.id)
        .update({ finished: false, finishNotes: '', updatedAt: this.$timestamp })
        .then(() => {
          this.$notifiy(this.$t('alert.sucess.restoreTask'), 'green')
        })
        .catch(() => {
          this.$notifiy(this.$t('alert.error.errorTryingToRestore'), 'green')
        })
      this.dialogRestoreTasks = false
    },

    updateTasks (newForm) {
      this.formTaskActive = newForm
      this.formTaskActive.updatedAt = this.$timestamp

      this.refTasks
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

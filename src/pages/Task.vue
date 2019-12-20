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

    <TabList
      :activelist="listTasksActive"
      :finishedlist="listTaskFinish"
      @showActivityTask="showActivityTask($event)"
      @showFinishTask="showFinishTask($event)"
      @showDeleteTask="showDeleteTask($event)"
      @showFinishedTask="showFinishedTask($event)"
      @showRestoreTask="showRestoreTask($event)"
    />

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

    <!-- Dialog Restore -->
    <DialogConfirm
      :dialog="dialogRestoreTasks"
      :question="$t('dialogs.questionRestore')"
      :title="formTaskFinish.title"
      :color="'green'"
      @eventClose="dialogRestoreTasks = false"
      @eventConfirm="restoreTasks()"
    />

    <!-- Dialog Finish Task -->
    <DialogConfirm
      :dialog="dialogoConcluirTarefa"
      :question="$t('dialogs.questionFinish')"
      :title="formTaskActive.title"
      :color="'green'"
      @eventClose="dialogoConcluirTarefa = false"
      @eventConfirm="finishTasks()"
    />

    <DialogAddNote
      :dialog="dialogoAddNota"
      :question="$t('dialogs.questionForAddNotes')"
      :title="formTaskActive.title"
      @eventClose="dialogoAddNota = false"
      @eventConfirm="addFinishNotes($event)"
    />
  </div>
</template>

<script>
import FabBtnAddDesktop from '../components/button/FabAddDesktop'
import FabBtnAddMobile from '../components/button/FabAddMobile'
import FabBtnBackPageMobile from '../components/button/FabBackPageMobile'
import FabBtnBackPageDesktop from '../components/button/FabBackPageDesktop'
import DialogViewActivityTask from '../components/dialogs/DialogViewActivityTask'
import DialogViewFinishedTask from '../components/dialogs/DialogViewFinishedTask'
import DialogAddTask from '../components/dialogs/DialogAddTask'
import DialogEditTask from '../components/dialogs/DialogEditTask'
import DialogConfirm from '../components/dialogs/DialogConfirm'
import DialogAddNote from '../components/dialogs/DialogAddNotes'
import TabList from '../components/lists/TabListTaks'

import crudTask from '../mixins/crudTask'

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
    DialogEditTask,
    DialogConfirm,
    DialogAddNote,
    TabList
  },
  mixins: [crudTask],
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
    showActivityTask (task) {
      this.resetForm()
      this.dialogShowActivityTasks = true
      this.formTaskActive = task
    },
    showFinishedTask (obj) {
      this.resetForm()
      this.dialogShowFinishedActivities = true
      this.formTaskFinish = obj
    },
    showDeleteTask (item) {
      this.resetForm()
      this.dialogDeleteTasks = true

      if (item.finished === false) {
        this.formTaskActive = item
      }
      if (item.finished === true) {
        this.formTaskFinish = item
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

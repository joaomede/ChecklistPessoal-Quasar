export default {
  methods: {
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
    addFinishNotes (note) {
      this.formTaskActive.finishNotes = note

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
    }
  }
}

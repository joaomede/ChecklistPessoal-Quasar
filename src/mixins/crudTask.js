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
    async getCurrentBoard () {
      try {
        const resp = await this.refBoard.get()
        this.$store.dispatch('setCurrentBoard', await resp.data())
      } catch (error) {
        this.$notifiy(error, 'red')
      }
    },
    async getCurrentFolder () {
      try {
        const resp = await this.refFolder.get()
        this.$store.dispatch('setCurrentFolder', await resp.data())
      } catch (error) {
        this.$notifiy(error, 'red')
      }
    },
    async storeTask (form) {
      this.formTaskActive = form
      this.dialogoAddTarefa = false
      try {
        const ref = await this.refTasks.add(this.formTaskActive)
        const pushID = { id: await ref.id, createdAt: this.$timestamp, updatedAt: this.$timestamp }
        await ref.update(pushID)
        this.$notifiy(this.$t('alert.sucess.addedTask'), 'green')
      } catch (error) {
        this.$notifiy(this.$t('alert.error.errorTryingToAdd'), 'green')
      }
      this.resetForm()
    },
    async finishTasks () {
      this.dialogoConcluirTarefa = false
      try {
        await this.refTasks.doc(this.formTaskActive.id).update({
          finished: true,
          updatedAt: this.$timestamp
        })
        this.$notifiy(this.$t('alert.sucess.finishTask'), 'green')
        this.dialogoAddNota = true
      } catch (error) {
        this.$notifiy(this.$t('alert.error.errorTryingToFinish'), 'green')
      }
    },
    async addFinishNotes (note) {
      this.formTaskActive.finishNotes = note
      this.dialogoAddNota = false
      try {
        await this.refTasks.doc(this.formTaskActive.id).update({
          finishNotes: this.formTaskActive.finishNotes
        })
        this.$notifiy(this.$t('alert.sucess.addedTask'), 'green')
      } catch (error) {
        this.$notifiy(this.$t('alert.error.errorTryingToAdd'), 'green')
      }
      this.dialogoAddNota = false
    },
    async destroyTask () {
      if (this.formTaskActive.finished === false) {
        try {
          await this.refTasks.doc(this.formTaskActive.id).delete()
          this.$notifiy(this.$t('alert.sucess.removedTask'), 'green')
        } catch (error) {
          this.$notifiy(this.$t('alert.error.errorTryingToRemove'), 'green')
        }
      }
      if (this.formTaskFinish.finished === true) {
        try {
          this.refTasks.doc(this.formTaskFinish.id).delete()
          this.$notifiy(this.$t('alert.sucess.removedTask'), 'green')
        } catch (error) {
          this.$notifiy(this.$t('alert.error.errorTryingToRemove'), 'green')
        }
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
    async restoreTasks () {
      this.dialogRestoreTasks = false
      try {
        await this.refTasks.doc(this.formTaskFinish.id).update(
          { finished: false,
            finishNotes: '',
            updatedAt: this.$timestamp
          })
        this.$notifiy(this.$t('alert.sucess.restoreTask'), 'green')
      } catch (error) {
        this.$notifiy(this.$t('alert.error.errorTryingToRestore'), 'green')
      }
    },
    async updateTasks (newForm) {
      this.formTaskActive = newForm
      this.formTaskActive.updatedAt = this.$timestamp

      this.dialogTasksEdit = false
      this.dialogShowActivityTasks = false

      try {
        await this.refTasks.doc(this.formTaskActive.id).update(this.formTaskActive)
        this.$notifiy(this.$t('alert.sucess.updatedTask'), 'green')
      } catch (error) {
        this.$notifiy(this.$t('alert.error.errorTryingToUpdated'), 'red')
      }
    }
  }
}

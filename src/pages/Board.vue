<template>
  <div>
    <div class="text-h4 text-center">
      {{ msg }}
    </div>
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
      v-if="$q.platform.is.mobile"
      round
      color="orange darken-2"
      class="fixed fabRight"
      @click.stop="(dialogoAddQuadro = true), resetFormBoard()"
    >
      <q-icon name="add" />
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
      v-if="$q.platform.is.desktop"
      round
      color="orange darken-2"
      class="fixed fabCenter"
      @click.stop="(dialogoAddQuadro = true), resetFormBoard()"
    >
      <q-icon
        class="iconFabCenter"
        name="add"
      />
    </q-btn>

    <!-- conteudo do quadro -->
    <div class="q-pa-md divPrincipal">
      <q-list bordered>
        <div class="text-h5 text-center">
          {{ $t('board.title') }}
        </div>
        <q-item
          v-for="boards in boardList"
          :key="boards.id"
          v-ripple
          clickable
          @click="runTaskScreen(boards)"
        >
          <q-item-section avatar>
            <q-avatar
              icon="dashboard"
              color="primary"
              text-color="secondary"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">
              {{ boards.title }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon
              name="edit"
              color="blue"
              @click.stop="showBoardEdit(boards)"
            />
          </q-item-section>

          <q-item-section side>
            <q-icon
              name="delete_sweep"
              color="grey ligten-1"
              @click.stop="showBoardDelete(boards)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- caixa de diálogo edita quadro -->
    <q-dialog v-model="dialogoEditaQuadro">
      <q-card
        class="text-center"
        style="width: 500px"
      >
        <q-card-section>
          <div class="text-h6">
            {{ $t('dialogs.editBoard') }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              v-model="board.title"
              label="Informe o nome do quadro"
              required
            />
          </q-form>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click.stop="dialogoEditaQuadro = false"
          >
            {{ $t('geral.back') }}
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="updateBoard()"
          >
            {{ $t('geral.save') }}
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo adiciona quadro -->
    <q-dialog v-model="dialogoAddQuadro">
      <q-card
        class="text-center"
        style="width: 500px"
      >
        <q-card-section>
          <div class="text-h6">
            {{ $t('dialogs.editBoard') }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              v-model="board.title"
              label="Informe o nome do quadro"
              required
            />
          </q-form>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click.stop="dialogoAddQuadro = false"
          >
            {{ $t('geral.back') }}
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="storeBoard"
          >
            {{ $t('geral.save') }}
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo apagar quadro confirmação -->
    <q-dialog v-model="dialogoApagaQuadro">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            {{ $t('dialogs.questionDelete') }}
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">
            {{ board.title }}
          </div>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click.stop="dialogoApagaQuadro = false"
          >
            {{ $t('geral.back') }}
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="destroyBoard()"
          >
            {{ $t('geral.yes') }}
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'Board',
  props: {
    idFolder: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogoAddQuadro: false,
      dialogoEditaQuadro: false,
      dialogoApagaQuadro: false,
      msg: 'Boards',
      board: {
        id: null,
        title: '',
        createdAt: null,
        updatedAt: null
      },
      boardList: []
    }
  },
  computed: {
    refQuadro () {
      if (this.user.uid != null) {
        return this.$firebase
          .firestore()
          .collection('app')
          .doc(this.user.uid)
          .collection('folder')
          .doc(this.idFolder)
          .collection('board')
          .orderBy('title', 'desc')
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
          .collection('folder')
          .doc(this.idFolder)
      } else {
        return null
      }
    }
  },
  watch: {
    refQuadro: 'init',
    user: 'init'
  },
  mounted () {
    this.init()
  },
  methods: {
    storeBoard () {
      if (this.board.title.includes('/') | this.board.title.includes('..')) {
        return
      }
      const newBoard = this.board

      this.$db.collection('app')
        .doc(this.user.uid)
        .collection('folder')
        .doc(this.idFolder)
        .collection('board')
        .add(newBoard)
        .then(ref => {
          const pushID = { id: ref.id, createdAt: this.$timestamp, updatedAt: this.$timestamp }
          ref.update(pushID)
          this.$notifiy(this.$t('alert.sucess.addedBoard'), 'green')
        })
        .catch(() => {
          this.$notifiy(this.$t('alert.error.errorTryingToAdd'), 'red')
        })

      this.dialogoAddQuadro = false
      this.resetFormBoard()
    },
    init () {
      this.getCurrentFolder()
      this.indexBoard()
    },
    indexBoard () {
      if ((this.user.uid != null) & (this.refQuadro != null)) {
        this.refQuadro.onSnapshot(querySnapshot => {
          this.boardList = []
          querySnapshot.forEach(doc => {
            this.boardList = doc.data()
          })
        })
      }
    },
    getCurrentFolder () {
      if (this.refPasta != null) {
        this.refPasta
          .get()
          .then(resp => {
            this.$store.dispatch('setCurrentFolder', resp.data())
            this.$store.dispatch('setCurrentBoard', { id: null })
          })
          .catch(err => {
            this.$notifiy(err, 'red')
          })
      }
    },
    runTaskScreen (board) {
      this.$router.push(
        { name: 'Task',
          params: {
            idBoard: (board.id).toString(),
            idFolder: (this.idFolder).toString()
          }
        }
      )
    },
    showBoardEdit (board) {
      this.dialogoEditaQuadro = true
      this.board = board
    },
    showBoardDelete (board) {
      this.dialogoApagaQuadro = true
      this.board = board
    },
    destroyBoard () {
      this.$db.collection('app')
        .doc(this.user.uid)
        .collection('folder')
        .doc(this.idFolder)
        .collection('board')
        .doc(this.board.id)
        .delete()
        .then(() => {
          this.$notifiy(this.$t('alert.sucess.removedFolder'), 'green')
        })
        .catch(() => {
          this.$notifiy(this.$t('alert.error.errorTryingToRemove'), 'red')
        })
      this.dialogoApagaQuadro = false
    },
    updateBoard () {
      if (this.board.title.includes('/') | this.board.title.includes('..')) {
        return
      }
      const newBoard = this.board
      newBoard.updatedAt = this.$timestamp
      this.$db.collection('app')
        .doc(this.user.uid)
        .collection('folder')
        .doc(this.idFolder)
        .collection('board')
        .doc(this.board.id)
        .update(newBoard)
        .then(() => {
          this.$notifiy(this.$t('alert.sucess.updatedBoard'), 'green')
        })
        .catch(() => {
          this.$notifiy(this.$t('alert.error.errorTryingToUpdated'), 'red')
        })
      this.dialogoEditaQuadro = false
      this.resetFormBoardBoard()
    },
    resetFormBoard () {
      this.board = {
        id: null,
        title: '',
        createdAt: null,
        updatedAt: null
      }
    }
  }
}
</script>

<style scoped>
form > * {
  display: block;
}
</style>

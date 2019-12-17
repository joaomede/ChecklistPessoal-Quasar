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
          Selecione o board
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
              @click.stop="editaQuadro(boards)"
            />
          </q-item-section>

          <q-item-section side>
            <q-icon
              name="delete_sweep"
              color="grey ligten-1"
              @click.stop="deletaQuadro(boards)"
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
            Edite o nome do do quadro
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
            Voltar
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="salvaEdicao()"
          >
            Salvar
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
            Adicione um quadro
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
            Voltar
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="criaQuadro"
          >
            Salvar
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo apagar quadro confirmação -->
    <q-dialog v-model="dialogoApagaQuadro">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Deseja realmente apagar este quadro?
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
            Voltar
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="apagaQuadroDB()"
          >
            Sim
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { stringify } from 'querystring'
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
    criaQuadro () {
      let b = this.title
      if (b.includes('/') | b.includes('..')) {
        // entrada para metodo de alerta de caractere proibido
        return
      }
      const newBoard = this.board

      this.$db.collection('app')
        .doc(this.user.uid)
        .collection('folder')
        .doc(this.id)
        .collection('board')
        .add(newBoard)
        .then(ref => {
          const pushID = { id: ref.id, createdAt: this.$timestamp, updatedAt: this.$timestamp }
          ref.update(pushID)
          this.$notifiy('Novo board Adicionada', 'green')
        })
        .catch(() => {
          this.$notifiy('Objeto não adicionado', 'red')
        })

      this.dialogoAddQuadro = false
      this.resetFormBoardBoard()
    },
    init () {
      this.carregaPastaAtual()
      this.carregaQuadro()
    },
    carregaQuadro () {
      if ((this.user.uid != null) & (this.refQuadro != null)) {
        this.refQuadro.onSnapshot(querySnapshot => {
          this.boardList = []
          querySnapshot.forEach(doc => {
            this.boardList = doc.data()
          })
        })
      }
    },
    carregaPastaAtual () {
      if (this.refPasta != null) {
        this.refPasta
          .get()
          .then(resp => {
            this.$store.dispatch('definePastaAtual', resp.data())
            this.$store.dispatch('defineQuadroAtual', { id: null })
          })
          .catch(err => {
            this.$notifiy(err, 'red')
          })
      }
    },
    runTaskScreen (board) {
      this.$router.push({ name: 'Task', params: { idBoard: stringify(board.id), idFolder: stringify(this.idFolder) } })
    },
    editaQuadro (board) {
      this.dialogoEditaQuadro = true
      this.board = board
    },
    deletaQuadro (board) {
      this.dialogoApagaQuadro = true
      this.board = board
    },
    apagaQuadroDB () {
      this.$db.collection('app')
        .doc(this.user.uid)
        .collection('folder')
        .doc(this.idFolder)
        .collection('board')
        .doc(this.board.id)
        .delete()
        .then(() => {
          this.$notifiy('board apagado com sucesso', 'green')
        })
        .catch(() => {
          this.$notifiy('Erro ao tentar apagar o contrato', 'red')
        })
      this.dialogoApagaQuadro = false
    },
    salvaEdicao () {
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
          this.$notifiy('board excluído com sucesso', 'green')
        })
        .catch(() => {
          this.$notifiy('Erro ao tentar excluir o quadro', 'red')
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

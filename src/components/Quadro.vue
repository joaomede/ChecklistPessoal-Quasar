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
      @click.stop="(dialogoAddQuadro = true), resetForm()"
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
      @click.stop="(dialogoAddQuadro = true), resetForm()"
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
          Selecione o Quadro
        </div>
        <q-item
          v-for="item in quadroData"
          :key="item.id"
          v-ripple
          clickable
          @click="carregaTarefas(item)"
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
              {{ item.title }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon
              name="edit"
              color="blue"
              @click.stop="editaQuadro(item)"
            />
          </q-item-section>

          <q-item-section side>
            <q-icon
              name="delete_sweep"
              color="grey ligten-1"
              @click.stop="deletaQuadro(item)"
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
              v-model="title"
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
              v-model="title"
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
            {{ title }}
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
import firebase from 'firebase'
import { db } from '../boot/firebase'

export default {
  name: 'Quadro',
  props: ['id'],
  data () {
    return {
      dialogoAddQuadro: false,
      dialogoEditaQuadro: false,
      dialogoApagaQuadro: false,
      msg: 'Quadros',
      id: '',
      title: '',
      quadroData: []
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
          .doc(this.id)
          .collection('Quadro')
          .orderBy('title', 'desc')
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
          .doc(this.id)
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
      const conteudo = {
        title: this.title,
        id: this.id
      }

      db.collection('app')
        .doc(this.user.uid)
        .collection('Pasta')
        .doc(this.id)
        .collection('Quadro')
        .add(conteudo)
        .then(ref => {
          const pushID = { id: ref.id }
          ref.update(pushID)
          this.$notifiy('Novo Quadro Adicionada', 'green')
        })
        .catch(() => {
          this.$notifiy('Objeto não adicionado', 'red')
        })

      this.dialogoAddQuadro = false
      this.title = ''
    },
    init () {
      this.carregaPastaAtual()
      this.carregaQuadro()
    },
    carregaQuadro () {
      if ((this.user.uid != null) & (this.refQuadro != null)) {
        this.refQuadro.onSnapshot(querySnapshot => {
          this.quadroData = []
          querySnapshot.forEach(doc => {
            this.quadroData.push({
              id: doc.id,
              title: doc.data().title
            })
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
    carregaTarefas (item) {
      this.$router.push({ name: 'Tarefas', params: { id: item.id, id: this.id } })
    },
    editaQuadro (item) {
      this.dialogoEditaQuadro = true
      this.title = item.title
      this.id = item.id
    },
    deletaQuadro (item) {
      this.dialogoApagaQuadro = true
      this.title = item.title
      this.id = item.id
    },
    apagaQuadroDB () {
      db.collection('app')
        .doc(this.user.uid)
        .collection('Pasta')
        .doc(this.id)
        .collection('Quadro')
        .doc(this.id)
        .delete()
        .then(() => {
          this.$notifiy('Quadro apagado com sucesso', 'green')
        })
        .catch(() => {
          this.$notifiy('Erro ao tentar apagar o contrato', 'red')
        })
      this.dialogoApagaQuadro = false
    },
    salvaEdicao () {
      let b = this.title
      if (b.includes('/') | b.includes('..')) {
        // entrada para metodo de alerta de caractere proibido
        return
      }
      const objeto = {
        title: this.title
      }
      db.collection('app')
        .doc(this.user.uid)
        .collection('Pasta')
        .doc(this.id)
        .collection('Quadro')
        .doc(this.id)
        .update(objeto)
        .then(() => {
          this.$notifiy('Quadro excluído com sucesso', 'green')
        })
        .catch(() => {
          this.$notifiy('Erro ao tentar excluir o quadro', 'red')
        })
      this.dialogoEditaQuadro = false
      this.title = ''
    },
    resetForm () {
      this.title = null
    }
  }
}
</script>

<style scoped>
form > * {
  display: block;
}
</style>

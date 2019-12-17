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
      class="fixed fabRight"
      @click.stop="(dialogoAddPasta = true), resetNameFolder()"
    >
      <q-icon name="add" />
    </q-btn>

    <q-btn
      v-if="$q.platform.is.desktop"
      round
      color="orange darken-2"
      class="fixed fabCenter"
      @click.stop="(dialogoAddPasta = true), resetNameFolder()"
    >
      <q-icon
        class="iconFabCenter"
        name="add"
      />
    </q-btn>

    <!-- conteudo pasta -->
    <div class="q-pa-md divPrincipal">
      <q-list bordered>
        <div class="text-h6 text-center">
          Selecione sua pasta pessoal
        </div>

        <q-item
          v-for="item in pastaData"
          :key="item.id"
          v-ripple
          clickable
          @click="carregaTelaQuadros(item)"
        >
          <q-item-section
            avatar
            top
          >
            <q-avatar
              icon="folder"
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
              @click.stop="editaPasta(item)"
            />
          </q-item-section>

          <q-item-section side>
            <q-icon
              name="delete_sweep"
              color="grey ligten-1"
              @click.stop="deletaPasta(item)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- caixa de diálogo adiciona pasta -->
    <q-dialog v-model="dialogoAddPasta">
      <q-card
        class="text-center"
        style="width: 500px"
      >
        <q-card-section>
          <div class="text-h6">
            Adicione uma pasta
          </div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              v-model="title"
              label="Informe o nome da pasta"
              required
            />
          </q-form>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click.stop="dialogoAddPasta = false"
          >
            Voltar
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="criaPasta"
          >
            Salvar
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo edita pasta -->
    <q-dialog v-model="dialogoEditaPasta">
      <q-card
        class="text-center"
        style="width: 500px"
      >
        <q-card-section>
          <div class="text-h6">
            Edite o nome da pasta
          </div>
        </q-card-section>

        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              v-model="title"
              label="Informe o nome da pasta"
              required
            />
          </q-form>
        </q-card-section>

        <q-card-section align="center">
          <q-btn
            class="q-ma-xs"
            color="black"
            @click.stop="dialogoEditaPasta = false"
          >
            Voltar
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="atualizaEditaPasta"
          >
            Salvar
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo apagar tarefa confirmação -->
    <q-dialog v-model="dialogoConfirmaDeletaPasta">
      <q-card>
        <q-card-section>
          <div class="text-h5">
            Deseja realmente apagar?
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
            @click.stop="dialogoConfirmaDeletaPasta = false"
          >
            Voltar
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="apagaPastaDB"
          >
            Sim
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- lista de pastas-->
  </div>
</template>

<script>
import firebase from 'firebase'
import { db } from '../boot/firebase'

export default {
  name: 'Dash',
  data () {
    return {
      dialogoAddPasta: false,
      dialogoEditaPasta: false,
      dialogoConfirmaDeletaPasta: false,

      msg: 'Bem vindo ao App',
      id: '',
      title: '',
      ref: firebase.firestore().collection('app'),
      pastaData: []
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
    refPasta () {
      if (this.user.uid != null) {
        return firebase
          .firestore()
          .collection('app')
          .doc(this.user.uid)
          .collection('Pasta')
          .orderBy('title', 'desc')
      } else {
        return null
      }
    }
  },
  watch: {
    refPasta: 'carregaPastas'
  },
  mounted () {
    this.$store.dispatch('definePastaAtual', { id: null })
    this.$store.dispatch('defineQuadroAtual', { id: null })
    this.carregaPastas()
  },

  methods: {
    criaPasta () {
      if (this.title.includes('/') || this.title.includes('..')) {
        // entrada para método de alerta caractere incorreto
        return
      }
      const conteudo = {
        title: this.title,
        id: null
      }

      db.collection('app')
        .doc(this.$store.getters.getUser.uid)
        .collection('Pasta')
        .add(conteudo)
        .then(ref => {
          const pushID = { id: ref.id }
          ref.update(pushID)
          this.$notifiy('Nova Pasta Adicionada', 'green')
        })
        .catch(() => {
          this.$notifiy('objeto não adicionado', 'red')
        })

      this.dialogoAddPasta = false
      this.title = ''
    },
    carregaPastas () {
      if ((this.user.uid != null) & (this.refPasta != null)) {
        this.refPasta.onSnapshot(querySnapshot => {
          this.pastaData = []
          querySnapshot.forEach(doc => {
            this.pastaData.push({
              id: doc.id,
              title: doc.data().title
            })
          })
        })
      }
    },
    atualizaEditaPasta () {
      let a = this.title
      if (a.includes('/') || a.includes('..')) {
        // entrada para método de alerta caractere incorreto
        return
      }
      const objeto = {
        title: this.title
      }
      db.collection('app')
        .doc(this.$store.getters.getUser.uid)
        .collection('Pasta')
        .doc(this.id)
        .update(objeto)
        .then(() => {
          this.$notifiy('Ultimo acesso atualizado', 'green')
        })
        .catch(() => {
          this.$notifiy('Acesso não atualizado', 'red')
        })
      this.dialogoEditaPasta = false
      this.title = ''
    },
    apagaPastaDB () {
      db.collection('app')
        .doc(this.user.uid)
        .collection('Pasta')
        .doc(this.id)
        .delete()
        .then(() => {
          this.$notifiy('Pasta removida com sucesso', 'green')
        })
        .catch(() => {
          this.$notifiy('Erro ao tentar remover pasta', 'red')
        })
      this.dialogoConfirmaDeletaPasta = false
    },
    // carrega tela quadros
    carregaTelaQuadros (item) {
      this.$router.push({
        name: 'Quadro',
        params: { id: item.id }
      })
    },
    editaPasta (item) {
      this.dialogoEditaPasta = true
      this.title = item.title
      this.id = item.id
    },
    deletaPasta (item) {
      this.dialogoConfirmaDeletaPasta = true
      this.title = item.title
      this.id = item.id
    },
    resetNameFolder () {
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

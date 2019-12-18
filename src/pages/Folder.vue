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
      @click.stop="(dialogoAddPasta = true), resetFolder()"
    >
      <q-icon name="add" />
    </q-btn>

    <q-btn
      v-if="$q.platform.is.desktop"
      round
      color="orange darken-2"
      class="fixed fabCenter"
      @click.stop="(dialogoAddPasta = true), resetFolder()"
    >
      <q-icon
        class="iconFabCenter"
        name="add"
      />
    </q-btn>

    <!-- content pasta -->
    <div class="q-pa-md divPrincipal">
      <q-list bordered>
        <div class="text-h6 text-center">
          Selecione sua pasta pessoal
        </div>

        <q-item
          v-for="folders in folderList"
          :key="folders.id"
          v-ripple
          clickable
          @click="runBoardScreen(folders)"
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
              {{ folders.title }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon
              name="edit"
              color="blue"
              @click.stop="showFolderEdit(folders)"
            />
          </q-item-section>

          <q-item-section side>
            <q-icon
              name="delete_sweep"
              color="grey ligten-1"
              @click.stop="showFolderDelete(folders)"
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
              v-model="folder.title"
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
              v-model="folder.title"
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
            {{ folder.title }}
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
import { stringify } from 'querystring'
export default {
  name: 'Dash',
  data () {
    return {
      dialogoAddPasta: false,
      dialogoEditaPasta: false,
      dialogoConfirmaDeletaPasta: false,

      msg: 'Bem vindo ao App',
      folder: {
        id: null,
        title: '',
        createdAt: null,
        updatedAt: null
      },
      ref: this.$firebase.firestore().collection('app'),
      folderList: []
    }
  },
  computed: {
    refPasta () {
      if (this.user.uid != null) {
        return this.$firebase
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
      const newFolder = {
        title: this.title,
        id: null,
        createdAt: null,
        updatedAt: null
      }

      this.$db.collection('app')
        .doc(this.user.uid)
        .collection('Pasta')
        .add(newFolder)
        .then(ref => {
          const pushID = { id: ref.id, createdAt: this.$timestamp, updatedAt: this.$timestamp }
          ref.update(pushID)
          this.$notifiy(this.$t('newFolderAdded'), 'green')
        })
        .catch(() => {
          this.$notifiy('object não adicionado', 'red')
        })

      this.dialogoAddPasta = false
      this.title = ''
    },
    carregaPastas () {
      if ((this.user.uid != null) & (this.refPasta != null)) {
        this.refPasta.onSnapshot(querySnapshot => {
          this.folderList = []
          querySnapshot.forEach(doc => {
            this.folderList.push(doc.data())
          })
        })
      }
    },
    atualizaEditaPasta () {
      if (this.folder.title.includes('/') || this.folder.title.includes('..')) {
        return
      }
      const newFolder = {
        title: this.folder.title,
        updatedAt: this.folder.updatedAt
      }
      this.$db.collection('app')
        .doc(this.user.uid)
        .collection('Pasta')
        .doc(this.id)
        .update(newFolder)
        .then(() => {
          this.$notifiy('Ultimo acesso atualizado', 'green')
        })
        .catch(() => {
          this.$notifiy('Acesso não atualizado', 'red')
        })
      this.dialogoEditaPasta = false
      this.resetFolder()
    },
    apagaPastaDB () {
      this.$db.collection('app')
        .doc(this.user.uid)
        .collection('Pasta')
        .doc(this.folder.id)
        .delete()
        .then(() => {
          this.$notifiy('Pasta removida com sucesso', 'green')
        })
        .catch(() => {
          this.$notifiy('Erro ao tentar remover pasta', 'red')
        })
      this.dialogoConfirmaDeletaPasta = false
    },
    runBoardScreen (folder) {
      this.$router.push({
        name: 'Board',
        params: { idFolder: stringify(folder.id) }
      })
    },
    showFolderEdit (folder) {
      this.dialogoEditaPasta = true
      this.folder = folder
    },
    showFolderDelete (folder) {
      this.dialogoConfirmaDeletaPasta = true
      this.folder = folder
    },
    resetFolder () {
      this.folder = {
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

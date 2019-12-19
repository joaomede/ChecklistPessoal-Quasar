<template>
  <div>
    <div class="text-h4 text-center">
      {{ $t('folder.welcome') }}
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
          {{ $t('folder.title') }}
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
            {{ $t('dialogs.addNewFolder') }}
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
            {{ $t('geral.back') }}
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="storeFolder"
          >
            {{ $t('geral.yes') }}
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
            {{ $t('dialogs.editFolder') }}
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
            {{ $t('geral.back') }}
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="updateFolder"
          >
            {{ $t('geral.yes') }}
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- caixa de diálogo apagar tarefa confirmação -->
    <q-dialog v-model="dialogoConfirmaDeletaPasta">
      <q-card>
        <q-card-section>
          <div class="text-h5">
            {{ $t('dialogs.editFolder') }}
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
            {{ $t('geral.back') }}
          </q-btn>
          <q-btn
            class="q-ma-xs"
            color="green"
            @click="destroyFolder"
          >
            {{ $t('geral.yes') }}
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
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
    refPasta: 'indexFolder'
  },
  mounted () {
    this.$store.dispatch('setCurrentFolder', { id: null })
    this.$store.dispatch('setCurrentBoard', { id: null })
    this.indexFolder()
  },

  methods: {
    storeFolder () {
      if (this.folder.title.includes('/') || this.folder.title.includes('..')) {
        return
      }
      const newFolder = {
        title: this.folder.title,
        id: null,
        createdAt: this.$timestamp,
        updatedAt: this.$timestamp
      }

      this.$db.collection('app')
        .doc(this.user.uid)
        .collection('Pasta')
        .add(newFolder)
        .then(ref => {
          const pushID = { id: ref.id }
          ref.update(pushID)
          this.$notifiy(this.$t('alert.sucess.addedFolder'), 'green')
        })
        .catch(() => {
          this.$notifiy(this.$t('alert.error.errorTryingToAdd'), 'red')
        })

      this.dialogoAddPasta = false
      this.resetFolder()
    },
    indexFolder () {
      if ((this.user.uid != null) & (this.refPasta != null)) {
        this.refPasta.onSnapshot(querySnapshot => {
          this.folderList = []
          querySnapshot.forEach(doc => {
            this.folderList.push(doc.data())
          })
        })
      }
    },
    updateFolder () {
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
          this.$notifiy(this.$t('alert.sucess.updatedFolder'), 'green')
        })
        .catch(() => {
          this.$notifiy(this.$t('alert.error.errorTryingToUpdated'), 'red')
        })
      this.dialogoEditaPasta = false
      this.resetFolder()
    },
    destroyFolder () {
      this.$db.collection('app')
        .doc(this.user.uid)
        .collection('Pasta')
        .doc(this.folder.id)
        .delete()
        .then(() => {
          this.$notifiy(this.$t('alert.sucess.removedFolder'), 'green')
        })
        .catch(() => {
          this.$notifiy(this.$t('alert.error.errorTryingToRemove'), 'red')
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

<template>
  <q-dialog v-model="dialogPopup">
    <q-card class="text-center">
      <q-card-section>
        <div class="text-h6">
          {{ $t('dialogs.editTask') }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-form class="q-gutter-md">
          <q-input
            v-model="formTask.title"
            label="Informe o titulo da tarefa"
            required
          />
        </q-form>
      </q-card-section>

      <q-card-section>
        <q-form class="q-gutter-md">
          <div class="text-h6">
            {{ $t('dialogs.description') }}
          </div>
          <q-editor
            v-model="formTask.content"
            :toolbar="editorTools"
            :fonts="nomeDasFontes"
          />
        </q-form>
      </q-card-section>

      <q-card-section align="center">
        <q-btn
          class="q-ma-xs"
          color="black"
          @click.stop="eventClose()"
        >
          {{ $t('geral.back') }}
        </q-btn>
        <q-btn
          class="q-ma-xs"
          color="green"
          @click="eventSave()"
        >
          {{ $t('geral.save') }}
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import iconSet from 'quasar/icon-set/fontawesome-v5'

export default {
  props: {
    dialog: Boolean,
    form: {
      type: Object,
      default: function () {
        return {
          id: null,
          finished: false,
          content: '',
          title: '',
          finishNotes: '',
          createdAt: '',
          updatedAt: ''
        }
      }
    }
  },
  data () {
    return {
      dialogPopup: this.dialog,
      formTask: {
        id: null,
        finished: false,
        content: '',
        title: '',
        finishNotes: '',
        createdAt: '',
        updatedAt: ''
      },
      editorTools: [
        [
          ['left'], ['center'], ['right'], ['justify']
        ], [
          ['bold'], ['italic'], ['strike'], ['underline']
        ],
        [
          ['quote'], ['unordered'], ['ordered'], ['outdent']
        ],
        [
          {
            label: 'Paragrafo',
            icon: iconSet.editor.formatting,
            list: 'no-icons',
            options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
          },
          {
            label: 'Font Size',
            icon: iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
          },
          {
            label: 'Font Type',
            icon: iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: ['default_font', 'arial', 'arial_black', 'comic_sans', 'courier_new', 'impact', 'lucida_grande', 'times_new_roman', 'verdana']
          }
        ],
        ['undo', 'redo', 'removeFormat']
      ],
      nomeDasFontes: {
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      }
    }
  },
  watch: {
    dialog: 'update',
    form: 'updateForm'
  },
  methods: {
    update () {
      this.dialogPopup = this.dialog
    },
    updateForm () {
      this.formTask = this.form
    },
    eventSave () {
      this.$emit('eventSave', this.formTask)
      this.formReset()
    },
    formReset () {
      this.formTask = {
        id: null,
        finished: false,
        content: '',
        title: '',
        finishNotes: '',
        createdAt: '',
        updatedAt: ''
      }
    },
    eventClose () {
      this.dialogPopup = false
      this.$emit('eventClose')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

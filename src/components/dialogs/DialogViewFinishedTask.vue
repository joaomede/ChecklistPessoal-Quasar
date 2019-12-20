<template>
  <q-dialog
    v-model="dialogPopup"
    @hide="eventClose()"
  >
    <q-card class="text-center backgroundCardColor">
      <q-card-section>
        <div class="text-h6 q-pa-xs backgroundTextoPopup">
          {{ form.title }}
        </div>
      </q-card-section>
      <q-card-section />

      <q-card-section v-if="form.content != null">
        <div
          class="text-h6 q-pa-xs backgroundTextoPopup"
          v-html="form.content"
        />
      </q-card-section>

      <q-card-section v-if="form.finishNotes != null">
        <div class="text-h6">
          {{ $t('dialogs.finishTaskNoteTitle') }}
        </div>
        <div class="text-h6">
          {{ form.finishNotes }}
        </div>
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
          color="red"
          @click="eventDelete()"
        >
          {{ $t('geral.delete') }}
        </q-btn>
      </q-card-section>

      <q-card-section />
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: function () {
        return {
          title: '',
          content: '',
          finishNotes: ''
        }
      }
    },
    dialog: Boolean
  },
  data () {
    return {
      dialogPopup: this.dialog
    }
  },
  watch: {
    dialog: 'update'
  },
  methods: {
    update () {
      this.dialogPopup = this.dialog
    },
    eventClose () {
      this.dialogPopup = false
      this.$emit('eventClose')
    },
    eventDelete () {
      this.$emit('eventDelete')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

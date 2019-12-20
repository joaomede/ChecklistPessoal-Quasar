<template>
  <q-dialog
    v-model="dialogPopup"
    @hide="eventClose()"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">
          {{ question }}
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">
          {{ title }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-form class="q-gutter-md">
          <q-input
            v-model="note"
            label="Informe a nota de conclusão"
            required
          />
        </q-form>
      </q-card-section>

      <q-card-section align="center">
        <q-btn
          class="q-ma-xs"
          color="black"
          @click.stop="dialogoAddNota = false"
        >
          {{ $t('geral.back') }}
        </q-btn>
        <q-btn
          class="q-ma-xs"
          color="green"
          @click="eventConfirm()"
        >
          {{ $t('geral.yes') }}
        </q-btn>
      </q-card-section>

      <q-card-section />
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean
    },
    title: {
      type: String,
      default: ''
    },
    question: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogPopup: this.dialog,
      note: ''
    }
  },
  watch: {
    dialog: 'update'
  },
  methods: {
    eventConfirm () {
      this.$emit('eventConfirm', this.note)
      this.note = ''
    },
    eventClose () {
      this.dialogPopup = false
      this.$emit('eventClose')
    },
    update () {
      this.dialogPopup = this.dialog
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

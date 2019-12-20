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
          :color="color"
          @click="eventConfirm()"
        >
          {{ $t('geral.yes') }}
        </q-btn>
      </q-card-section>
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
          content: ''
        }
      }
    },
    question: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
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
    eventConfirm () {
      this.$emit('eventConfirm')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<template>
  <q-dialog
    v-model="dialogPopup"
    @hide="eventClose()"
  >
    <q-card
      class="text-center"
      style="width: 500px"
    >
      <q-card-section>
        <div class="text-h6">
          {{ message }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-form class="q-gutter-md">
          <q-input
            v-model="title"
            :label="label"
            required
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
          @click="storeEvent()"
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
    dialog: {
      type: Boolean
    },
    label: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dialogPopup: this.dialog,
      title: ''
    }
  },
  watch: {
    dialog: 'update'
  },
  methods: {
    storeEvent () {
      this.$emit('storeEvent', this.title)
      this.title = ''
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

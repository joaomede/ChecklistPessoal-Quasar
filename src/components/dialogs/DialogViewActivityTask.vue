<template>
  <q-dialog
    v-model="dialogPopup"
    @hide="eventClose()"
  >
    <q-card class="text-center backgroundCardColor">
      <q-card-section>
        <div class="q-pa-xs backgroundTextoPopup">
          <div class="text-h6">
            {{ form.title }}
          </div>
        </div>
      </q-card-section>

      <q-card-section />

      <q-card-section v-if="form.content != ''">
        <div class="q-pa-xs backgroundTextoPopup">
          <div v-html="form.content" />
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
        <q-btn
          class="q-ma-xs"
          color="green"
          @click="eventEdit()"
        >
          {{ $t('geral.edit') }}
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
          content: ''
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
    eventEdit () {
      this.$emit('eventEdit')
    },
    eventDelete () {
      this.$emit('eventDelete')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

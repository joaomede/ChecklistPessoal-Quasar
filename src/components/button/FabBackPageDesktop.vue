<template>
  <q-btn
    v-if="$q.platform.is.desktop"
    round
    color="orange darken-2"
    class="fixed fabBack"
    @click.stop="$router.go(-1)"
  >
    <q-icon name="fas fa-arrow-left" />
  </q-btn>
</template>

<script>
export default {
  methods: {
    eventClick () {
      this.$emit('eventClick')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

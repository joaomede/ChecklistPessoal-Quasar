<template>
  <div class="centralDiv q-pa-xs text-center">
    <q-card class="text-center my-card" align-center>
      <q-img src="../../statics/symbol2logo.png" style="height: 140px; max-width: 150px" />
      <div class="centralDiv">
        <q-card-section class="q-pa-md q-gutter-sm">
          <div class="text-h6 text-bold">Sistema desenvolvido pela</div>
          <div class="text-h6 text-bold">Symbol 2 Studio</div>
          <div class="text-h6 text-bold">(2019 - {{ versionUpdate }})</div>
          <div class="text-h6 text-bold">Contribuições:</div>
          <q-btn color="black" type="a" target="_blank" href="https://github.com/joaomede">
            <div class="row items-center no-wrap">
              <div class="text-center">João Medeiros</div>
            </div>
          </q-btn>

          <q-btn color="black" type="a" target="_blank" href="https://github.com/augustoOliveira1993">
            <div class="row items-center no-wrap">
              <div class="text-center">Augusto Oliveira</div>
            </div>
          </q-btn>

          <div class="text-h6">Contatos: (11) 96849-8492</div>
          <div class="text-h6">E-mail: symbol2studio@gmail.com</div>
        </q-card-section>
      </div>
      <q-card-section class="q-gutter-md">
        <q-btn color="green" to="/dash">Volta para Página Inicial</q-btn>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      key: value
    };
  },
  computed: {
    versionUpdate() {
      if (this.$store.getters.getUltimaVersao) {
        return this.$store.getters.getUltimaVersao;
      } else {
        return;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
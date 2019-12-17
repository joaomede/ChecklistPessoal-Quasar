export default {
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    version () {
      return this.$store.getters.getVersion
    },
    nomeUsuario () {
      if (this.user.uid != null) {
        return this.$store.getters.getNomeUsuario
      } else {
        return 'Usuario'
      }
    },
    pastaAtual () {
      if (this.$store.getters.getPastaAtual != null) {
        return this.$store.getters.getPastaAtual
      } else {
        return null
      }
    },
    quadroAtual () {
      if (this.$store.getters.getQuadroAtual != null) {
        return this.$store.getters.getQuadroAtual
      } else {
        return null
      }
    }
  }
}

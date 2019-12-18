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
    currentFolder () {
      if (this.$store.getters.getCurrentFolder != null) {
        return this.$store.getters.getCurrentFolder
      } else {
        return null
      }
    },
    currentBoard () {
      if (this.$store.getters.getCurrentBoard != null) {
        return this.$store.getters.getCurrentBoard
      } else {
        return null
      }
    }
  }
}

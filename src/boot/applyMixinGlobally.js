import mixinComputed from '../mixins/globallyComputed'

export default async ({ Vue }) => {
  Vue.mixin(mixinComputed)
}

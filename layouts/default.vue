<template lang="pug">
  div
    app-navigation
    nuxt
    app-footer
</template>

<script>
import AppNavigation from '~/components/AppNavigation.vue'
import AppFooter from '~/components/Footer.vue'
export default {
  components: {
    AppNavigation,
    AppFooter,
  },
  methods: {},
}
</script>

<template>
  <component v-bind:is="svg" />
</template>

<script>
export default {
  name: 'SVGElement',
  props: {
    name: {
      type: String,
    },
  },
  computed: {
    svg() {
      return () => import(`~/assets/img/${this.name}.svg`)
    },
  },
}
</script>

<style lang="scss" scoped>
svg {
  width: 0;
  height: auto;
  transition: 0.5s all cubic-bezier(0.39, 0.575, 0.565, 1);
}
</style>

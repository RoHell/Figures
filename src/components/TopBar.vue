<script setup lang="ts">
const emit = defineEmits<{
  (e: 'back'): void,
  (e: 'menu'): void,
}>()

</script>

<template>
  <div class="top-bar">
    <p
      class="top-bar__title"
      @click="emit('back')"
    >
      Game<em><b>bit</b></em>
    </p>
  </div>
</template>

<style lang="scss" scoped>
  .top-bar {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    padding: 1rem;

    &__title {
      font-size: xx-large;
      text-transform: uppercase;
      flex: 1;
      font-weight: 500;
      margin: auto;
      text-align: center;
    }
  }

  @media screen and (orientation: landscape) {
    .top-bar {
      flex-direction: column;
      height: 100%;

      &__title {
        text-orientation: upright;
        writing-mode: vertical-rl;
      }
    }
  }
</style>
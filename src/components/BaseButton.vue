<script setup lang="ts">
interface Props {
  label?: string
}

withDefaults(defineProps<Props>(), {
  label: '',
})

const emit = defineEmits<{
  (e: 'click'): void,
}>()
</script>

<template>
  <button
    type="button"
    class="base-button"
    @click="emit('click')"
  >
    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<style lang="scss" scoped>
  .base-button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    gap: 1rem;
    border: 2px solid;
    min-width: 8rem;
    height: 3rem;
    padding: 0.75rem;
    border-radius: 0.25rem;

    &__left,
    &__right,
    &__center {
      margin: auto
    }
  }
</style>
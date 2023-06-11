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
    v-bind="$attrs"
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
    border: 2px solid;
    min-width: 8rem;
    height: 3rem;
    padding: 0.75rem;
    border-radius: 0.25rem;
    
    &:disabled {
      opacity: 0.5;
    }
  }
</style>
<script setup lang="ts">

interface Props {
  startDisabled: boolean
}

withDefaults(defineProps<Props>(), {
  startDisabled: false
})

const emit = defineEmits<{
  (e: 'start'): void,
  (e: 'stop'): void,
}>()
</script>

<template>
  <div class="actions">
    <button
      type="button"
      class="actions__start"
      :disabled="startDisabled"
      @click="emit('start')"
      v-text="'start'"
    />
    <button
      type="button"
      class="actions__stop"
      @click="emit('stop')"
      v-text="'stop'"
    />
  </div>
</template>

<style lang="scss" scoped>
.actions {
  display: flex;
  gap: 1rem;
  margin: auto;

  &__start {
    background-color: red;
    border-radius: 0.25rem;
  }

  &__stop {
    background-color: blue;
    border-radius: 0.25rem;
  }
}
</style>
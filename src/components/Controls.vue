<script setup lang="ts">
import useCoordinates from '../composables/useCoordinates'
import useStatus from '../composables/useStatus'

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'stop'): void
  (e: 'check'): void
}>()

const { playerFieldCoordinates } = useCoordinates()
const { isPlaying } = useStatus()
</script>

<template>
  <div class="controls">
    <template v-if="isPlaying">
      <button
        type="button"
        class="controls__stop"
        @click="emit('stop')"
        v-text="'stop'"
      />
      <button
        type="button"
        class="controls__check"
        :disabled="!playerFieldCoordinates"
        v-text="'check'"
        @click="emit('check')"
      />
    </template>

    <button
      v-else
      type="button"
      @click="emit('start')"
      class="controls__start"
      v-text="'start'"
    />
  </div>
</template>

<style lang="scss" scoped>
  .controls {
    display: flex;
    margin: auto;
    gap: 1rem;

    &__playing {

    }

    &__check,
    &__stop,
    &__start {
      text-transform: uppercase;
      background-color: transparent;
      font-size: 1.25rem;
      padding: 1rem;
    }
    &__check,
    &__start {
      border-radius: 0.25rem;
      border: 2px solid white;
      &:disabled {
        border-color: gray;
      }
    }
  }
</style>
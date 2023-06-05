<script setup lang="ts">
import {
  useStatus,
  useCoordinates,
} from '../composables'

const emit = defineEmits<{
  (e: 'start'): void,
  (e: 'check'): void,
  (e: 'stop'): void,
}>()

const { isPlaying, isSelectingPieces, isChecking } = useStatus()
const { playerFieldCoordinates } = useCoordinates()

</script>

<template>
  <div class="bottom-bar">
    <div class="bottom-bar__left">
      <slot name="left" />
    </div>
    <div class="bottom-bar__center">
      <button
        v-if="isChecking || (isPlaying && !playerFieldCoordinates)"
        type="button"
        class="bottom-bar__stop"
        v-text="'stop'"
        @click="emit('stop')"
      />
      <button
        v-else-if="isPlaying"
        type="button"
        class="bottom-bar__check"
        v-text="'check'"
        @click="emit('check')"
      />
      <button
        v-else
        type="button"
        :disabled="isSelectingPieces"
        @click="emit('start')"
        class="bottom-bar__start"
        v-text="'start'"
      />
    </div>
    <div class="bottom-bar__right">
      <slot name="right" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

  
  .bottom-bar {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 1rem;
    width: 100%;

    &__start,
    &__check,
    &__stop {
      text-transform: uppercase;
      background-color: transparent;
      font-size: 1rem;
      padding: 0.75rem;
      height: 100%;
      width: 5.25rem;
      border-radius: 0.25rem;
      border: 2px solid white;
      outline: none;
      &:disabled {
        border-color: gray;
        pointer-events: none;
      }
    }

    &__left,
    &__right,
    &__center {
      margin: auto;
    }
    
    &__left,
    &__right {
      flex: 1;
    }
  }
</style>
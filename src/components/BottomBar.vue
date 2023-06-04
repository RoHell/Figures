<script setup lang="ts">
import {
  useStatus,
  useCoordinates,
} from '../composables'

const emit = defineEmits<{
  (e: 'start'): void,
  (e: 'check'): void,
  (e: 'back'): void,
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
        v-if="isPlaying"
        type="button"
        class="bottom-bar__check"
        :disabled="!playerFieldCoordinates || isChecking"
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
    &__check {
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

    &__grid,
    &__pieces,
    &__back {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      height: 100%;
      width: 100%;
      background-color: transparent;
      outline: none;
    }
  }
</style>
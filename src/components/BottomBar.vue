<script setup lang="ts">
import { IconEnum } from '../types'

import {
  useStatus,
  useCoordinates,
  useGrid,
  usePieces,
} from '../composables'

import Icon from '../components/Icon.vue'

const emit = defineEmits<{
  (e: 'start'): void,
  (e: 'check'): void,
  (e: 'grid'): void,
  (e: 'pieces'): void,
  (e: 'back'): void,
}>()

const { isPlaying } = useStatus()
const { playerFieldCoordinates } = useCoordinates()
const { gridSize } = useGrid()
const { piecesCount } = usePieces()

</script>

<template>
  <nav class="bottom-bar">
    <div class="bottom-bar__left">
      <button
        v-if="isPlaying"
        class="bottom-bar__back"
        @click="emit('back')"
      >
        <Icon :icon="IconEnum.back" size="3rem"/>
      </button>
      <button
        v-else
        type="button"
        class="bottom-bar__grid"
        @click="emit('grid')"
      >
        <Icon :icon="IconEnum.grid" size="2.5rem"/>
        <span v-text="`${gridSize} x ${gridSize}`" />
      </button>
    </div>
    <div class="bottom-bar__center">
      <button
        v-if="isPlaying"
        type="button"
        class="bottom-bar__check"
        :disabled="!playerFieldCoordinates"
        v-text="'check'"
        @click="emit('check')"
      />
      <button
        v-else
        type="button"
        @click="emit('start')"
        class="bottom-bar__start"
        v-text="'start'"
      />
    </div>
    <div class="bottom-bar__right">
      <button
        v-if="!isPlaying"
        type="button"
        class="bottom-bar__pieces"
        @click="emit('pieces')"
      >
        <div class="bottom-bar__pieces-icon">
          <span v-text="`${piecesCount} x `" />
          <Icon :icon="IconEnum.pawn" size="2rem"/>
        </div>
        <span v-text="'random'" />
      </button>
    </div>
  </nav>
</template>

<style lang="scss" scoped>

  
  .bottom-bar {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 1rem;
    width: 100%;
    height: var(--bottom-bar-height);
    padding: 0.5rem 1rem;

    &__start,
    &__check {
      text-transform: uppercase;
      background-color: transparent;
      font-size: 1rem;
      padding: 1rem;
      height: 100%;
      width: 100%;
      border-radius: 0.25rem;
      border: 2px solid white;
      outline: none;
      &:disabled {
        border-color: gray;
      }
    }

    &__left,
    &__right,
    &__center {
      margin: auto;
      width: 100%
    }

    &__grid,
    &__pieces,
    &__back {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      font-size: smaller;
      padding: 0.25rem;
      height: 100%;
      width: 100%;
      background-color: transparent;
      outline: none;
    }

    &__pieces-icon {
      display: flex;
      align-items: center;
      font-size: 1rem;
    }
  }
  @media screen and (orientation: landscape) {
    .bottom-bar {
      flex-direction: column;
      height: 100%;
    }
  }
</style>
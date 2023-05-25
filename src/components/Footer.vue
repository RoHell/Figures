<script setup lang="ts">
import { IconEnum } from '../types'

import {
  useStatus,
  useCoordinates,
  useGrid,
  useFigures,
} from '../composables'

import Icon from '../components/Icon.vue'

const emit = defineEmits<{
  (e: 'start'): void,
  (e: 'check'): void,
  (e: 'grid'): void,
  (e: 'pieces'): void,
}>()

const { isPlaying } = useStatus()
const { playerFieldCoordinates } = useCoordinates()
const { gridSize } = useGrid()
const { figuresCount } = useFigures()

</script>

<template>
  <footer class="footer">
    <div class="footer__left">
      <button
        v-if="!isPlaying"
        type="button"
        class="footer__grid"
        @click="emit('grid')"
      >
        <Icon :icon="IconEnum.grid" size="2.5rem"/>
        <span v-text="`${gridSize} x ${gridSize}`" />
      </button>
    </div>
    <div class="footer__center">
      <button
        v-if="isPlaying"
        type="button"
        class="footer__check"
        :disabled="!playerFieldCoordinates"
        v-text="'check'"
        @click="emit('check')"
      />
      <button
        v-else
        type="button"
        @click="emit('start')"
        class="footer__start"
        v-text="'start'"
      />
    </div>
    <div class="footer__right">
      <button
        v-if="!isPlaying"
        type="button"
        class="footer__pieces"
        @click="emit('pieces')"
      >
        <div class="footer__pieces-icon">
          <span v-text="`${figuresCount} x `" />
          <Icon :icon="IconEnum.pawn" size="2rem"/>
        </div>
        <span v-text="'random'" />
      </button>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    height: 100%;
    height: var(--footer-height);
    padding: 0.5rem 1rem;
    border-top: 1px solid;
    background-color: dimgray;

    &__center {
      margin: auto;
      height: 100%;
      flex: 1;
    }

    &__start,
    &__check {
      text-transform: uppercase;
      background-color: transparent;
      font-size: 1rem;
      padding: 0.5rem;
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
    &__right {
      display: flex;
      margin: auto;
      height: 100%;
      flex: 1;
    }

    &__grid,
    &__pieces {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
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
</style>
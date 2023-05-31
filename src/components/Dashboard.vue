<script lang="ts" setup>
import { IconEnum, GridSizeEnum } from '../types'

import {
  useGrid,
  usePieces,
  useStatus,
} from '../composables'

import Icon from '../components/Icon.vue'

const emit = defineEmits<{
  (e: 'start'): void,
  (e: 'check'): void,
  (e: 'grid', count: GridSizeEnum): void,
  (e: 'pieces', count: number): void,
  (e: 'back'): void,
}>()

const { gridSize, grids } = useGrid()
const { piecesRange, piecesCount } = usePieces()
const { isPlaying } = useStatus()

</script>

<template>
  <div class="dashboard">
    <section class="dashboard__section">
      <span class="dashboard__section-title">grids</span>
      <div class="dashboard__section-content dashboard__section-content--grids">
        <button
          v-for="grid in grids"
          class="dashboard__grid dashboard__grid--grid"
          :class="{
            'dashboard__grid--active': gridSize === grid.count
          }"
          :disabled="isPlaying"
          @click="emit('grid', grid.count)"
        >
          <span class="dashboard__grid-name" v-text="grid.name" />
      </button>
      </div>
    </section>

    <section class="dashboard__section">
      <div class="dashboard__section-title">
        <span>pieces</span>
        <span v-text="piecesCount" />
      </div>
      <div class="dashboard__section-content dashboard__section-content--pieces">
        <button
          v-for="count in piecesRange"
          class="dashboard__grid dashboard__grid--piece"
          :class="{
            'dashboard__grid--active': count <= piecesCount
          }"
          :disabled="isPlaying"
          @click="emit('pieces', count)"
        >
          <Icon :icon="IconEnum.pawn"/>
      </button>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  align-items: center;
  overflow: auto;
}

.dashboard__section {
  display: flex;
  width: 100%;
  gap: 0.5rem;

  &-title {
    text-transform: uppercase;
    display: none;
    flex-direction: column;
  }

  &-content {
    display: grid;
    width: 100%;

    &--grids {
      gap: 0.2rem;
      grid-template-columns: repeat(auto-fill, minmax(2.6rem, 1fr));
    }

    &--pieces {
      grid-template-columns: repeat(auto-fill, minmax(1.9rem, 1fr));
    }
  }
}

.dashboard__grid {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: smaller;
  font-weight: 700;
  background-color: transparent;
  border: 1px solid;

  &:hover:not(.dashboard__grid--active) {
    border-color: white;
    background-color: rgba(dimgray, 0.7);
  }

  &:disabled {
    pointer-events: none;
  }

  &--grid {
    border-color: white;
    padding: 0.2rem;
  }

  &--piece {
    border-color: transparent;
    padding: 0.1rem 0;
  }

  &--active {
    background-color: dimgray;
    border-color: white;
  }
}

@media screen and (orientation: landscape) {
  .dashboard {
    flex-direction: column;
  }
}
</style>
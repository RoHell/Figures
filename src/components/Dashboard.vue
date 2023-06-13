<script lang="ts" setup>
import { IconEnum, GridSizeEnum } from '../types'

import {
  useGrid,
  usePieces,
  useStatus,
  useQuest,
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
const { isChecking } = useStatus()
const { isQuestMode, fetchStorageQuest, activeStorageQuest } = useQuest()

const disableGrid = (count: GridSizeEnum) => {
  fetchStorageQuest()
  return isChecking.value || isNextElement({count, type: 'grid'})
}

const disablePieces = (count: number) => {
  fetchStorageQuest()
  const { grid } = activeStorageQuest()
  return isChecking.value || (isNextElement({count, type: 'pieces'}) && (gridSize.value >= grid))
}

const isNextElement = ({ count, type}: { count: number, type: 'grid' | 'pieces' }) => {
  const { grid, pieces } = activeStorageQuest()
  const elementCount = type === 'grid' ? grid : pieces
  return !!((isQuestMode.value && elementCount) && (count > elementCount))
}

</script>

<template>
  <div class="dashboard">
    <section class="dashboard__section">
      <span class="dashboard__section-title">grids</span>
      <div class="dashboard__section-content dashboard__section-content--grids">
        <button
          v-for="grid in grids"
          class="dashboard__grid dashboard__matrix"
          :class="{
            'dashboard__matrix--active': gridSize === grid.count
          }"
          :disabled="disableGrid(grid.count)"
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
          class="dashboard__grid dashboard__pieces"
          :class="{
            'dashboard__pieces--active': count <= piecesCount
          }"
          :disabled="disablePieces(count)"
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
      grid-template-columns: repeat(auto-fill, minmax(2.8rem, 1fr));
    }

    &--pieces {
      gap: 1px;
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
}

.dashboard__matrix {
  padding: 0.2rem;

  &--active {
    background-color: var(--active-background-color);
  }
}

.dashboard__pieces {
  border: none;
  padding: 0.25rem 0;
  border-radius: 0.25rem;

  &--active {
    background-color: var(--active-background-color);
  }
}

@media screen and (orientation: landscape) {
  .dashboard {
    flex-direction: column;
  }
}
</style>
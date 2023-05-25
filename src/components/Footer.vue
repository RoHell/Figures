<script setup lang="ts">
import { IconEnum, LevelEnum, GridSizeEnum } from '../types'

import {
  useStatus,
  useCoordinates,
  useGrid,
  useFigures,
} from '../composables'

import Icon from '../components/Icon.vue'

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'check'): void
}>()

const { isPlaying } = useStatus()
const { playerFieldCoordinates } = useCoordinates()
const { gridSize, setGridSize } = useGrid()
const { figuresCount, setFiguresCount } = useFigures()

const pieces = [
  {
    name: 'easy',
    count: LevelEnum.easy,
  },
  {
    name: 'medium',
    count: LevelEnum.medium,
  },
  {
    name: 'hard',
    count: LevelEnum.hard,
  },
  {
    name: 'extreme',
    count: LevelEnum.extreme,
  },
  {
    name: 'insane',
    count: LevelEnum.insane,
  },
]

const grids = [
  {
    name: '4 x 4',
    count: GridSizeEnum.four,
  },
  {
    name: '6 x 6',
    count: GridSizeEnum.six,
  },
  {
    name: '8 x 8',
    count: GridSizeEnum.eight,
  },
]

const setGrid = () => {
  const currentGridIndex = grids.findIndex(grid => grid.count === gridSize.value)
  const gridCount = gridSize.value < grids[grids.length - 1].count ? grids[currentGridIndex + 1]?.count : grids[0].count
  setGridSize(gridCount)
}

const setPieces = () => {
  const currentPieceIndex = pieces.findIndex(piece => piece.count === figuresCount.value)
  const piecesCount = figuresCount.value < pieces[pieces.length - 1].count ? pieces[currentPieceIndex + 1]?.count : pieces[0].count
  setFiguresCount(piecesCount)
}

</script>

<template>
  <footer class="footer">
    <div class="footer__left">
      <button
        type="button"
        class="footer__grid"
        @click="setGrid"
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
        type="button"
        class="footer__pieces"
        @click="setPieces"
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
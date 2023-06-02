<script setup lang="ts">
import {
  GridSizeEnum,
  type CoordinatesInterface,
  type PieceInterface,
} from './types'

import { IconEnum } from './types'

import Pieces from './components/Pieces.vue'
import Grid from './components/Grid.vue'
import Dashboard from './components/Dashboard.vue'
import TopBar from './components/TopBar.vue'
import BottomBar from './components/BottomBar.vue'
import Menu from './components/Menu.vue'
import Icon from './components/Icon.vue'
import ProgressBar from './components/ProgressBar.vue'

import {
  useGrid,
  usePieces,
  useCoordinates,
  useMarkedFields,
  usePlayer,
  useStatus,
  useProgress,
} from './composables'

const {
  gridSize,
  setGridSize,
} = useGrid()

const {
  setRandomPiecesList,
  clearRandomPiecesList,
  randomPiecesList,
  selectedPiece,
  piecesCount,
  setPiecesCount,
  maxPiecesCount,
} = usePieces()

const {
  setPieceMovesCoordinates,
  allPiecesMovesCoordinates,
  playerFieldCoordinates,
  isSameCoordinates,
} = useCoordinates()

const {
  setMarkedFields,
  clearMarkedFields,
} = useMarkedFields()

const {
  isPlayerCatched,
  setPlayerField,
  clearPlayerField,
} = usePlayer()

const {
  isPlaying,
  isChecking,
  isMenuOpen,
  isTimingOn,
  timingValue,
} = useStatus()

const {
  timoutProgress,
  startCountdown,
  resetProgress,
  isCounting,
} = useProgress()

let checkResultTimeout: string | number | NodeJS.Timeout | undefined

const handleStart = () => {
  clearFields()
  isPlaying.value = true
  setRandomPiecesList()
  if (isTimingOn.value) {
    startCountdown()
    const timing = isCounting.value ? 0 : timingValue.value * 1000
    handleCheck(timing)
  }
}

const handleStop = () => {
  clearFields()
  isPlaying.value = false
}

const checkResult = () => {
  if (!playerFieldCoordinates.value || isPlayerCatched()) {
    handleStop()
  } else {
    clearFields()
    handleStart()
  }
}

const markFields = () => {
  randomPiecesList.value?.forEach((piece) => {
    setPieceMovesCoordinates(piece)
    setMarkedFields()
  })
}

const handleCheck = (timeout: number = 0) => {
  setTimeout(() => {
    markFields()
    checkGameResult()
  }, timeout)
}

const checkGameResult = () => {
  if (isCounting) {
    clearTimeout(checkResultTimeout)
  }
  isChecking.value = true
  checkResultTimeout = setTimeout(() => {
    checkResult()
    isChecking.value = false
  }, timingValue.value * 1000)
}

const clearFields = () => {
  resetProgress()
  clearMarkedFields()
  clearRandomPiecesList()
  clearPlayerField()
}

const handleMouseDown = (fieldCoordinates: CoordinatesInterface) => {
  selectedPiece.value = randomPiecesList.value?.find((piece: PieceInterface) => isSameCoordinates(fieldCoordinates, piece.coordinates))

  if (selectedPiece.value) {
    allPiecesMovesCoordinates.value = []
    setPieceMovesCoordinates(selectedPiece.value)
    setMarkedFields()
  } else {
    setPlayerField(fieldCoordinates)
  }
}

const handleMouseUp = () => selectedPiece.value && clearMarkedFields()

const setGrid = (count: GridSizeEnum) => {
  setGridSize(count)

  if (piecesCount.value > maxPiecesCount.value) {
    setPiecesCount(maxPiecesCount.value)
  }
}
</script>

<template>
  <div class="app">
    <div class="app__panel">
      <TopBar>
        <template #left>
          <button
            v-if="isPlaying"
            type="button"
            @click="handleStop"
          >
            <Icon :icon="IconEnum.back" size="2rem"/>
          </button>
        </template>
        <template #right>
          <button
            type="button"
            @click="isMenuOpen = true"
          >
            <Icon :icon="IconEnum.more" size="2rem"/>
          </button>
        </template>
      </TopBar>

      <Dashboard
        @grid="setGrid"
        @pieces="setPiecesCount"
      />

      <div class="app__controls">
        <BottomBar
        @start="handleStart"
        @check="handleCheck"
        />
        <ProgressBar
          v-if="isTimingOn"
          :progress="timoutProgress"
        />
      </div>

      <Transition name="slide-down">
        <Menu
          v-if="isMenuOpen"
          title="Menu"
          class="app__menu"
          @close="isMenuOpen = false"
        />
      </Transition>

    </div>

    <div class="app__grid">
      <Grid
        :cols="gridSize"
        @up="handleMouseUp"
        @down="handleMouseDown"
      />
      <Pieces />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  justify-content: space-between;
  height: 100%;
  max-height: 100vh;

  &__panel {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 1rem;
    min-width: 16rem;
    padding: 0.5rem;
  }

  &__grid {
    aspect-ratio: 1;
    margin: auto;
    padding: 0.5rem;
  }

  &__menu {
    position: absolute;
    left: 0;
    top: 0;
  }

  &__controls {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: auto;
    gap: 1rem;
  }
}

@media screen and (orientation: portrait) {
  .app {
    flex-direction: column;

    &__grid {
      height: 100%;
      max-height: 100vw;
    }
  }
}

@media screen and (orientation: landscape) {
  .app {
    flex-direction: row;

    &__grid {
      width: 100%;
      max-width: 100vh;
    }
  }
}
</style>
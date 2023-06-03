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
  isCountdownMode,
  countdownFrom,
} = useStatus()

const {
  countdownProgress,
  startCountdown,
  resetProgress,
  isCountdownOn,
} = useProgress()

let checkResultTimeout: string | number | NodeJS.Timeout | undefined
let markFieldsTimeout: string | number | NodeJS.Timeout | undefined

const handleStart = () => {
  clearFields()
  isPlaying.value = true
  setRandomPiecesList()
  if (isCountdownMode.value) {
    startCountdown()
    handleCheck()
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

const handleCheck = () => {
  const timeout = isCountdownOn.value ? 0 : countdownFrom.value * 1000
  clearTimeout(markFieldsTimeout)
  markFieldsTimeout = setTimeout(() => {
    markFields()
    checkGameResult()
  }, timeout)
}

const checkGameResult = () => {
  isChecking.value = true
  clearTimeout(checkResultTimeout)
  checkResultTimeout = setTimeout(() => {
    checkResult()
    isChecking.value = false
  }, 3000)
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
          v-if="isCountdownMode"
          :progress="countdownProgress"
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
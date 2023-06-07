<script setup lang="ts">
import {
  GridSizeEnum,
  GameModeEnum,
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
  useCountdown,
  useQuest,
} from './composables'

const {
  gridSize,
  setGridSize,
  INITIAL_GRID_SIZE,
  isLastGrid,
} = useGrid()

const {
  setRandomPiecesList,
  clearRandomPiecesList,
  randomPiecesList,
  selectedPiece,
  piecesCount,
  setPiecesCount,
  maxPiecesCount,
  INITIAL_PIECES_COUNT,
  markKillerField,
  clearKillerField,
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
  checkPlayerStatus,
  isPlayerCaptured,
  setPlayerField,
  clearPlayerField,
} = usePlayer()

const {
  isPlaying,
  isChecking,
  isMenuOpen,
  isCountdownMode,
  countdownFrom,
  gameMode,
} = useStatus()

const {
  INITIAL_COUNTDOWN_FROM_VALUE,
  countdownProgress,
  startCountdown,
  stopCountdown,
  resetProgress,
} = useCountdown()

const {
  quest,
  isQuestMode,
} = useQuest()

let checkResultTimeout: string | number | NodeJS.Timeout | undefined
let markFieldsTimeout: string | number | NodeJS.Timeout | undefined

const handleStart = async() => {
  clearFields()
  isPlaying.value = true
  if (isQuestMode.value) {
    await setGridSize(quest.grid)
    await setPiecesCount(quest.pieces)
    countdownFrom.value = piecesCount.value + 1
  }

  await setRandomPiecesList()

  if (isCountdownMode.value) {
    await startCountdown()

    handleCheck(countdownFrom.value * 1000)
  }
}

const handleStop = () => {
  clearFields()
  isPlaying.value = false
  isChecking.value = false
}

const checkResult = async() => {
  if (!playerFieldCoordinates.value || isPlayerCaptured.value) {
    handleStop()
  } else {
    if (isQuestMode.value) {
      if (quest.pieces === maxPiecesCount.value) {
        quest.grid = isLastGrid.value ? INITIAL_GRID_SIZE : quest.grid + 1
        quest.pieces = INITIAL_PIECES_COUNT
      } else {
        quest.pieces++
      }
    }
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
  clearTimeout(markFieldsTimeout)

  markFieldsTimeout = setTimeout(() => {
    markFields()
    checkGameResult()
    markKillerField()
  }, timeout)
}

const checkGameResult = () => {
  checkPlayerStatus()
  const timeout = isPlayerCaptured.value ? 4000 : 3000
  isChecking.value = true
  clearTimeout(checkResultTimeout)

  checkResultTimeout = setTimeout(() => {
    checkResult()
    clearKillerField()
    isChecking.value = false
  }, timeout)
}

const clearFields = () => {
  resetProgress()
  stopCountdown()
  clearTimeout(checkResultTimeout)
  clearTimeout(markFieldsTimeout)
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

const setGrid = async(count: GridSizeEnum) => {
  if (isQuestMode.value && !isCountdownMode.value) {
    quest.grid = count
    quest.pieces = INITIAL_PIECES_COUNT
    handleStart()
  } else {
    await handleStop()
    await setGridSize(count)

    if (piecesCount.value > maxPiecesCount.value) {
      setPiecesCount(maxPiecesCount.value)
    }

    if (isPlaying.value) {
      setRandomPiecesList()
    }
  }
}

const setPieces = async(count: number) => {
  if (isQuestMode.value && !isCountdownMode.value) {
    quest.pieces = count
    handleStart()
  } else {
    await handleStop()
    await setPiecesCount(count)

    if (isPlaying.value) {
      setRandomPiecesList()
    }
  }
}

const handleGameModeChange = async(mode: GameModeEnum) => {
  if (mode === gameMode.value) { return }

  isPlaying.value = false
  isChecking.value = false

  await clearFields()
  quest.grid = INITIAL_GRID_SIZE
  quest.pieces = INITIAL_PIECES_COUNT
  countdownFrom.value = INITIAL_COUNTDOWN_FROM_VALUE
  await setGridSize(quest.grid)
  await setPiecesCount(quest.pieces)
  gameMode.value = mode
}
</script>

<template>
  <div class="app">
    <div class="app__panel">
      <TopBar>
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
        @pieces="setPieces"
      />

      <div class="app__controls">
        <BottomBar
          @start="handleStart"
          @check="handleCheck"
          @stop="handleStop"
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
          @game-mode="handleGameModeChange"
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

<script setup lang="ts">
import { onMounted } from 'vue'

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
  showPromptActions,
  isTempMode,
} = useStatus()

const {
  INITIAL_COUNTDOWN_FROM_VALUE,
  startCountdown,
  stopCountdown,
} = useCountdown()

const {
  quest,
  isQuestMode,
  INITIAL_QUEST,
  setStorageQuest,
  fetchStorageQuest,
  activeStorageQuest,
} = useQuest()

let checkResultTimeout: string | number | NodeJS.Timeout | undefined
let markFieldsTimeout: string | number | NodeJS.Timeout | undefined

const handleStart = async() => {
  clearFields()
  isPlaying.value = true
  countdownFrom.value = piecesCount.value + 1

  await setRandomPiecesList()

  if (isQuestMode.value) {
    await updateAppWithStoredQuest()
  }

  if (isCountdownMode.value) {
    await startCountdown()

    handleCheck(countdownFrom.value * 1000)
  }
}

const handleStop = () => {
  clearFields()
  isPlaying.value = false
  isChecking.value = false
  isTempMode.value = false
}

const checkResult = async() => {
  if (!playerFieldCoordinates.value || isPlayerCaptured.value) {
    handleStop()
  } else {
    if (isQuestMode.value) {
      await fetchStorageQuest()
      if (quest.value?.pieces === maxPiecesCount.value) {
        setStorageQuest({
          grid: isLastGrid.value ? INITIAL_GRID_SIZE : quest.value.grid as number + 1,
          pieces: INITIAL_PIECES_COUNT,
        })
      } else {
        setStorageQuest({
          grid: quest.value.grid,
          pieces: quest.value.pieces as number + 1,
        })
      }
      const { pieces, grid } = quest.value
      await setGridSize(grid)
      await setPiecesCount(pieces)
    }
    handleStart()
  }
}

const updateAppWithStoredQuest = async() => {
  await fetchStorageQuest()
  const { pieces, grid } = quest.value
  setGridSize(grid)
  setPiecesCount(pieces)
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
    stopCountdown()
  }, timeout)
}

const checkGameResult = () => {
  checkPlayerStatus()
  const timeout = isPlayerCaptured.value ? 4000 : 2000
  isChecking.value = true
  clearTimeout(checkResultTimeout)

  checkResultTimeout = setTimeout(() => {
    checkResult()
    clearKillerField()
    isChecking.value = false
  }, timeout)
}

const clearFields = () => {
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
  if (count === gridSize.value) { return }

  await handleStop()

  if (isQuestMode.value) {
    await fetchStorageQuest()
    if (count < quest.value.grid) {
      isTempMode.value = true
      await fetchStorageQuest()
      setStorageQuest({
        grid: count,
        pieces: quest.value.pieces
      })
    }
    await setPiecesCount(quest.value.pieces)
  } else {
    if (piecesCount.value > maxPiecesCount.value) {
      await setPiecesCount(maxPiecesCount.value)
    }
  }

  await setGridSize(count)
}

const setPieces = async(count: number) => {
  await handleStop()

  if (isQuestMode.value) {
    await fetchStorageQuest()
    const { grid, pieces } = quest.value
    if ((gridSize.value < grid) || (count < pieces)) {
      isTempMode.value = true
      setStorageQuest({
        grid,
        pieces: count,
      })
    }
  }

  await setPiecesCount(count)
}

const handleGameModeChange = async(mode: GameModeEnum) => {
  if (mode === gameMode.value) { return }

  gameMode.value = mode
  isPlaying.value = false
  isChecking.value = false

  await clearFields()
  countdownFrom.value = INITIAL_COUNTDOWN_FROM_VALUE
  if (gameMode.value === GameModeEnum.school) {
    await setGridSize(INITIAL_GRID_SIZE)
    await setPiecesCount(INITIAL_PIECES_COUNT)
  } else {
    showPromptActions.value = true
    updateAppWithStoredQuest()
  }
}

const handleCountdownChange = async(mode: boolean) => {
  isCountdownMode.value = mode
  await handleStop()
  const { grid, pieces } = activeStorageQuest()
  setGridSize(grid)
  setPiecesCount(pieces)
}

const handleContinue = async() => {
  showPromptActions.value = false
  await handleStop()
  const { grid, pieces } = activeStorageQuest()
  setGridSize(grid)
  setPiecesCount(pieces)
}

const handleNew = async() => {
  showPromptActions.value = false
  setStorageQuest(INITIAL_QUEST)
  await handleStop()
  setGridSize(INITIAL_GRID_SIZE)
  setPiecesCount(INITIAL_PIECES_COUNT)
}

onMounted(async() => {
  if (isQuestMode.value) {
    await updateAppWithStoredQuest()
  }
})
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
          @continue="handleContinue"
          @new="handleNew"
        />
      </div>

      <Transition name="slide-down">
        <Menu
          v-if="isMenuOpen"
          title="Menu"
          class="app__menu"
          @close="isMenuOpen = false"
          @game-mode="handleGameModeChange"
          @countdown="handleCountdownChange"
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

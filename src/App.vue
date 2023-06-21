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
import Statistics from './components/Statistics.vue'

import {
  useGrid,
  usePieces,
  useCoordinates,
  useMarkedFields,
  usePlayer,
  useStatus,
  useCountdown,
  useQuest,
  useStorage,
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
  showStatistics,
} = useStatus()

const {
  INITIAL_COUNTDOWN_FROM_VALUE,
  startCountdown,
  stopCountdown,
} = useCountdown()

const {
  quest,
  isQuestMode,
  failedQuestStage,
  setStorageQuest,
  fetchStorageQuest,
  activeStorageQuest,
  setStorageQuestFails,
  failedQuestStages,
  isStageInProgress,
  isActiveQuest,
} = useQuest()

const {
  clearStorage,
} = useStorage()

let checkResultTimeout: string | number | NodeJS.Timeout | undefined
let markFieldsTimeout: string | number | NodeJS.Timeout | undefined

const handleStart = async() => {
  isPlaying.value = true
  countdownFrom.value = piecesCount.value + 1
  
  await clearFields()
  await setRandomPiecesList()

  if (isQuestMode.value) {
    await updateAppWithStoredQuest()
  }
  
  if (isCountdownMode.value) {
    await startCountdown()

    handleCheck(countdownFrom.value * 1000)
  }
}

const handleStop = async() => {
  await clearFields()
  isPlaying.value = false
  isChecking.value = false
}

const handleQuestResult = async() => {
  await fetchStorageQuest()
  const { grid, pieces } = quest.value

  if (isTempMode.value && isActiveQuest.value) {
    isTempMode.value = false
  }

  if (!playerFieldCoordinates.value || isPlayerCaptured.value) {
    setStorageQuestFails({
      grid: failedQuestStage.value?.grid || grid || INITIAL_GRID_SIZE,
      pieces: failedQuestStage.value?.pieces || pieces || INITIAL_PIECES_COUNT,
      fails: (failedQuestStage.value?.fails || 0) + 1
    })
    await handleStop()
  } else {
    if (pieces === maxPiecesCount.value) {
      if (isLastGrid.value) {
        showStatistics.value = true
        showPromptActions.value = true
      } else {
        setStorageQuest({
          grid: grid + 1,
          pieces: INITIAL_PIECES_COUNT,
        })
      }
    } else {
      setStorageQuest({
        grid,
        pieces: pieces + 1,
      })
    }
    await updateAppWithStoredQuest()
    if (isActiveQuest.value) {
      isTempMode.value = false
    }
    handleStart()
  }
}

const handleSchoolResult = async() => {
  if (!playerFieldCoordinates.value || isPlayerCaptured.value) {
    await handleStop()
  } else {
    handleStart()
  }
}

const updateAppWithStoredQuest = async() => {
  await fetchStorageQuest()
  const { pieces, grid } = quest.value
  setGridSize(grid)
  setPiecesCount(pieces)
}

const setInitialAppState = async() => {
  await setGridSize(INITIAL_GRID_SIZE)
  await setPiecesCount(INITIAL_PIECES_COUNT)
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
    if (isQuestMode.value) {
      handleQuestResult()
    } else {
      handleSchoolResult()
    }
    clearKillerField()
    isChecking.value = false
  }, timeout)
}

const clearFields = async() => {
  await stopCountdown()
  await clearTimeout(checkResultTimeout)
  await clearTimeout(markFieldsTimeout)
  await clearMarkedFields()
  await clearRandomPiecesList()
  await clearPlayerField()
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
  await setGridSize(count)
  if (isQuestMode.value) {
    if (count < quest.value.grid) {
      isTempMode.value = true
      await setStorageQuest({
        grid: count,
        pieces: maxPiecesCount.value,
      })
      await setPiecesCount(maxPiecesCount.value)
    } else {
      isTempMode.value = false
      await fetchStorageQuest()
      await setPiecesCount(quest.value.pieces)
    }
  } else {
    await setPiecesCount(INITIAL_PIECES_COUNT)
  }
}

const setPieces = async(count: number) => {
  if (isQuestMode.value) {
      const { pieces } = await activeStorageQuest()
    if (isActiveQuest.value && count === pieces) {
      isTempMode.value = false
    } else {
      isTempMode.value = true
      await setStorageQuest({
        grid: gridSize.value,
        pieces: count,
      })
      if (isActiveQuest.value) {
        isTempMode.value = false
      }
    }
  }
  await setPiecesCount(count)
}

const handleGameModeChange = async(mode: GameModeEnum) => {
  await handleStop()

  if (mode === gameMode.value) { return }

  gameMode.value = mode
  
  countdownFrom.value = INITIAL_COUNTDOWN_FROM_VALUE

  if (gameMode.value === GameModeEnum.school) {
    showPromptActions.value = false
    await setInitialAppState()
  } else {
    if (isStageInProgress.value) {
      showPromptActions.value = true
    }
    updateAppWithStoredQuest()
  }
}

const handleCountdownChange = async(mode: boolean) => {
  await handleStop()
  isCountdownMode.value = mode
}

const handleContinue = async() => {
  showPromptActions.value = false
  await handleStop()
  isTempMode.value = false
  const { grid, pieces } = activeStorageQuest()
  setGridSize(grid)
  setPiecesCount(pieces)
}

const handleNew = async() => {
  await handleStop()
  isTempMode.value = false
  showPromptActions.value = false
  setInitialAppState()
  clearStorage()
  failedQuestStages.value = []
}

onMounted(async() => {
  if (isQuestMode.value) {
    await updateAppWithStoredQuest()
  }
  if (isStageInProgress.value) {
    showPromptActions.value = true
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

      <Transition name="slide-left">
        <Menu
          v-if="isMenuOpen"
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
    <Transition name="slide-left">
      <Statistics
        v-if="showStatistics"
        class="app__statistics"
        @close="showStatistics = false"
      />
    </Transition>
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

  &__statistics {
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

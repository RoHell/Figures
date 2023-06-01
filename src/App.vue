<script setup lang="ts">
import {
  GridSizeEnum,
  type CoordinatesInterface,
  type PieceInterface,
} from './types'

import Pieces from './components/Pieces.vue'
import Grid from './components/Grid.vue'
import Dashboard from './components/Dashboard.vue'
import TopBar from './components/TopBar.vue'
import BottomBar from './components/BottomBar.vue'

import {
  useGrid,
  usePieces,
  useCoordinates,
  useMarkedFields,
  usePlayer,
  useStatus,
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
} = useStatus()

const handleStart = () => {
  clearFields()
  isPlaying.value = true
  setRandomPiecesList()
}

const handleStop = () => {
  clearFields()
  isPlaying.value = false
}

const handleCheck = (timeout: number = 0) => {
  setTimeout(() => {
    randomPiecesList.value?.forEach((piece) => {
      setPieceMovesCoordinates(piece)
      setMarkedFields()
    })
    checkGameResult()
  }, timeout)
}

const checkGameResult = () => {
  isChecking.value = true
  setTimeout(async () => {
    if (!playerFieldCoordinates.value || isPlayerCatched()) {
      await handleStop()
    } else {
      await clearFields()
      handleStart()
    }
    isChecking.value = false
  }, 3000)
}

const clearFields = () => {
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
      <TopBar
        @back="handleStop"
      />
      <Dashboard
        @grid="setGrid"
        @pieces="setPiecesCount"
      />
      <BottomBar
        class="bottom-bar--landscape"
        @start="handleStart"
        @check="handleCheck"
        @back="handleStop"
      />
    </div>
    <div class="app__grid">
      <Grid
        :cols="gridSize"
        @up="handleMouseUp"
        @down="handleMouseDown"
      />
      <Pieces />
    </div>
    <BottomBar
      class="bottom-bar--portrait"
      @start="handleStart"
      @check="handleCheck"
      @back="handleStop"
    />
  </div>
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  justify-content: space-between;
  height: 100%;
  max-height: 100vh;

  &__panel {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 1rem;
    min-width: 16rem;
  }

  &__grid {
    aspect-ratio: 1;
    margin: auto;
    padding: 0.5rem;
  }
}

@media screen and (orientation: portrait) {
  .app {
    flex-direction: column;

    &__panel {
      padding: 0.5rem 0.5rem 0;
    }

    &__grid {
      height: 100%;
      max-height: 100vw;
    }

    .bottom-bar {
      padding: 0.5rem;
      &--landscape {
        display: none;
      }
    }
  }
}

@media screen and (orientation: landscape) {
  .app {
    flex-direction: row;

    &__panel {
      padding: 0.5rem 0 0.5rem 0.5rem;
    }

    &__grid {
      width: 100%;
      max-width: 100vh;
    }

    .bottom-bar {
      margin-top: auto;

      &--portrait {
        display: none;
      }
    }
  }
}
</style>
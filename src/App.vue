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
  piecesRange,
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
    setPiecesCount(piecesRange.value[0])
  }
}
</script>

<template>
  <div class="app">
    <main>
      <div class="app__dashboard">
        <TopBar
          @back="handleStop"
        />
        <Dashboard
          @grid="setGrid"
          @pieces="setPiecesCount"
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
    </main>

    <footer>
      <BottomBar
        @start="handleStart"
        @check="handleCheck"
        @back="handleStop"
      />
    </footer>

  </div>
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  height: 100%;
  max-height: 100vh;

  &__grid,
  &__dashboard,
  footer {
    padding: 1rem;
  }

  &__grid {
    aspect-ratio: 1;
    margin: auto;
  }

  &__dashboard {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 1rem;
  }
}

footer {
  display: flex;
  align-items: flex-end;
}

main {
  display: flex;
  flex: 1;
}

@media screen and (orientation: portrait) {
  .app {
    flex-direction: column;

    &__grid {
      height: 100%;
      max-height: 100vw;
    }

    main {
      flex-direction: column;
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
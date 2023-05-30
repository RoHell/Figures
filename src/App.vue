<script setup lang="ts">
import {
  type CoordinatesInterface,
  type PieceInterface,
} from './types'

import Pieces from './components/Pieces.vue'
import Grid from './components/Grid.vue'
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
  currentGridCount,
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
  isMenuOpen,
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

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const toggleGrid = () => {
  setGridSize(currentGridCount.value)

  if (piecesCount.value > maxPiecesCount.value) {
    setPiecesCount(piecesRange.value[0])
  }
}

const setPieces = () => {
  const currentPieceCount = piecesCount.value < piecesRange.value.length ? piecesCount.value + 1 : piecesRange.value[0]
  setPiecesCount(currentPieceCount)
}
</script>

<template>
  <div class="app">
    <header>
      <TopBar
        @back="handleStop"
        @menu="toggleMenu"
      />
    </header>

    <main>
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
        @grid="toggleGrid"
        @pieces="setPieces"
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

  &__grid {
    padding: 1rem;
    aspect-ratio: 1;
    margin: auto;
  }
}

header {
  display: flex;
  align-items: flex-start;
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
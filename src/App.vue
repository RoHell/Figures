<script setup lang="ts">
import {
  type CoordinatesInterface,
  type FigureInterface,
} from './types'

import Figures from './components/Figures.vue'
import Grid from './components/Grid.vue'
import TopBar from './components/TopBar.vue'
import BottomBar from './components/BottomBar.vue'

import {
  useGrid,
  useFigures,
  useCoordinates,
  useMarkedFields,
  usePlayer,
  useStatus,
} from './composables'

const {
  gridSize,
  setGridSize,
  GRIDS,
} = useGrid()

const {
  setRandomFiguresList,
  clearRandomFiguresList,
  randomFiguresList,
  selectedFigure,
  figuresCount,
  setFiguresCount,
  PIECES,
} = useFigures()

const {
  setFigureMovesCoordinates,
  allFiguresMovesCoordinates,
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
  setRandomFiguresList()
}

const handleStop = () => {
  clearFields()
  isPlaying.value = false
}

const handleCheck = (timeout: number = 0) => {
  setTimeout(() => {
    randomFiguresList.value?.forEach((figure) => {
      setFigureMovesCoordinates(figure)
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
  clearRandomFiguresList()
  clearPlayerField()
}

const handleMouseDown = (fieldCoordinates: CoordinatesInterface) => {
  selectedFigure.value = randomFiguresList.value?.find((figure: FigureInterface) => isSameCoordinates(fieldCoordinates, figure.coordinates))

  if (selectedFigure.value) {
    allFiguresMovesCoordinates.value = []
    setFigureMovesCoordinates(selectedFigure.value)
    setMarkedFields()
  } else {
    setPlayerField(fieldCoordinates)
  }
}

const handleMouseUp = () => selectedFigure.value && clearMarkedFields()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const setGrid = () => {
  const currentGridIndex = GRIDS.findIndex(grid => grid.count === gridSize.value)
  const gridCount = gridSize.value < GRIDS[GRIDS.length - 1].count ? GRIDS[currentGridIndex + 1]?.count : GRIDS[0].count
  setGridSize(gridCount)
}

const setPieces = () => {
  const currentPieceIndex = PIECES.findIndex(piece => piece.count === figuresCount.value)
  const piecesCount = figuresCount.value < PIECES[PIECES.length - 1].count ? PIECES[currentPieceIndex + 1]?.count : PIECES[0].count
  setFiguresCount(piecesCount)
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
        <Figures />
      </div>
    </main>

    <footer>
      <BottomBar
        @start="handleStart"
        @check="handleCheck"
        @grid="setGrid"
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
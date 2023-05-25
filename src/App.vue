<script setup lang="ts">
import {
  type CoordinatesInterface,
  type FigureInterface,
} from './types'

import Figures from './components/Figures.vue'
import Grid from './components/Grid.vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

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
} = useGrid()

const {
  setRandomFiguresList,
  clearRandomFiguresList,
  randomFiguresList,
  selectedFigure,
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
  isStopped,
  isChecking,
  isMenuOpen,
} = useStatus()

const handleStart = () => {
  clearFields()
  isStopped.value = false
  isPlaying.value = true
  setRandomFiguresList()
}

const handleStop = () => {
  clearFields()
  isStopped.value = true
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
</script>

<template>
  <Header
    @back="handleStop"
    @menu="toggleMenu"
  />

  <main class="app">
    <div class="app__main">
      <Grid
        :cols="gridSize"
        class="app__grid"
        @up="handleMouseUp"
        @down="handleMouseDown"
      />
    </div>
    <Figures />
  </main>

  <Footer
    @start="handleStart"
    @check="handleCheck"
  />
</template>

<style lang="scss" scoped>
header {
  position: fixed;
  top: 0;
  z-index: 10;
}

footer {
  position: fixed;
  bottom: 0;
  z-index: 10;
}

.app {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  margin: var(--header-height) auto var(--footer-height);

  &__main {
    position: relative;
    aspect-ratio: 1;
  }

  &__grid {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}

@media screen and (orientation: portrait) {
  .app {
    max-width: var(--app-max-width);
  }
}

@media screen and (orientation: landscape) {
  .app {
    width: calc(100vh - var(--header-height) - var(--footer-height))
  }
}
</style>

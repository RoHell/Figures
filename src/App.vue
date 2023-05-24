<script setup lang="ts">
import {
  type CoordinatesInterface,
  type FigureInterface,
} from './types'

import Figures from './components/Figures.vue'
import Grid from './components/Grid.vue'
import Menu from './components/Menu.vue'
import Controls from './components/Controls.vue'

import useGrid from './composables/useGrid'
import useFigures from './composables/useFigures'
import useCoordinates from './composables/useCoordinates'
import useMarkedFields from './composables/useMarkedFields'
import usePlayer from './composables/usePlayer'
import useStatus from './composables/useStatus'

const {
  setGridSize,
  gridSize,
} = useGrid()

const {
  setRandomFiguresList,
  clearRandomFiguresList,
  setFiguresCount,
  randomFiguresList,
  figuresCount,
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
</script>

<template>
  <header>
    <h1>Avoid Figures</h1>
  </header>
  <main class="avoid-figures">
    <div class="avoid-figures__main">
      <Grid
        :cols="gridSize"
        :disabled="isChecking"
        class="avoid-figures__grid"
        @up="handleMouseUp"
        @down="handleMouseDown"
      />
      <Menu
        v-if="!isPlaying"
        class="avoid-figures__menu"
        :start-disabled="isPlaying"
        :active-level="figuresCount"
        :active-grid-cols="gridSize"
        @start="handleStart"
        @level="setFiguresCount"
        @grid="setGridSize"
      />
    </div>

    <Controls
      @start="handleStart"
      @stop="handleStop"
      @check="handleCheck"
    />

    <Figures />
  </main>
</template>

<style scoped lang="scss">
.avoid-figures {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  margin: 0 auto;
  max-width: 340px;

  &__main {
    position: relative;
    aspect-ratio: 1;
    max-height: 340px;
  }

  &__grid {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  &__menu {
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.6);
  }
}
</style>

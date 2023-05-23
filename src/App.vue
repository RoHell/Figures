<script setup lang="ts">
import {
  type CoordinatesInterface,
  type FigureInterface,
} from './types'

import Figures from './components/Figures.vue'
import Grid from './components/Grid.vue'
import Actions from './components/Actions.vue'

import useGrid from './composables/useGrid'
import useFigures from './composables/useFigures'
import useCoordinates from './composables/useCoordinates'
import useMarkedFields from './composables/useMarkedFields'
import usePlayer from './composables/usePlayer'
import useStatus from './composables/useStatus'

const {
  setGrid,
  gridCols,
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

const handleMouseUp = () => selectedFigure.value && clearMarkedFields({ content: false })
</script>

<template>
  <header>
    <h1>Avoid Figures</h1>
  </header>
  <main class="avoid-figures">
    <Grid
      @up="handleMouseUp"
      @down="handleMouseDown"
      :cols="gridCols"
      :disabled="isChecking"
    />
    <div
      v-if="isPlaying"
      class="avoid-figures__controls"
    >
      <button
        type="button"
        class="avoid-figures__stop"
        @click="handleStop()"
        v-text="'stop'"
      />
      <button
        type="button"
        class="avoid-figures__check"
        :disabled="!playerFieldCoordinates"
        v-text="'check'"
        @click="handleCheck()"
      />
    </div>
    <Figures />
    <Actions
      v-if="!isPlaying"
      @start="handleStart"
      @level="setFiguresCount"
      @grid="setGrid"
      :start-disabled="isPlaying"
      :active-level="figuresCount"
      :active-grid-cols="gridCols"
    />
  </main>
</template>

<style scoped lang="scss">
.avoid-figures {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  margin: 0 auto;
  max-width: 340px;

  &__controls {
    display: flex;
    margin: auto;
    gap: 1rem;
  }

  &__check,
  &__stop {
    text-transform: uppercase;
    background-color: transparent;
    font-size: 1.25rem;
    padding: 1rem;
  }
  &__check {
    border-radius: 0.25rem;
    border: 2px solid white;
    &:disabled {
      border-color: gray;
    }
  }
}
.actions {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
}
</style>

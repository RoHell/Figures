<script setup lang="ts">
import { computed, ref } from 'vue';
import { IconEnum, type CoordinatesInterface } from './types'

import Figures from './components/Figures.vue'
import Grid from './components/Grid.vue'
import Actions from './components/Actions.vue'

const figureName = ref('')
const figureFieldCoordinates = ref<CoordinatesInterface>()
const playerFieldCoordinates = ref<CoordinatesInterface>()
const markedFieldsCoordinates = ref<CoordinatesInterface[]>([])
const playerField = ref<Element>()
const isPlaying = ref(false)
const isStopped = ref(false)
const isGameOver = ref(false)

const figureField = computed((): Element => getFieldElement(figureFieldCoordinates.value as CoordinatesInterface))
const figureElement = computed((): Element => getFigureElement(figureName.value))
const gridFields = computed(() => document.querySelectorAll('.grid__field') || [])
const markedFields = computed(() => [...markedFieldsCoordinates.value].map((coord: CoordinatesInterface) => getFieldElement(coord)))
const isPlayerCatched = computed(() => {
  if (!playerFieldCoordinates.value) { return }
  return [...markedFieldsCoordinates.value].some(({ x: markedX, y: markedY }) => {
    const { x: playerX, y: playerY } = playerFieldCoordinates.value as CoordinatesInterface
    return (playerX === markedX) && (playerY === markedY)
  })
})

const handleStart = () => {
  isStopped.value = false
  isPlaying.value = true
  positionFigure()
  markFields()
}

const handleStop = () => {
  markedFieldsCoordinates.value = []
  clearFields()
  isStopped.value = true
  isPlaying.value = false
}

const positionFigure = () => {
  clearFigureField()
  setFigureName()
  setFigureFieldCoordinates()
  if (figureField.value && figureElement.value) {
    figureField.value.innerHTML = figureElement.value.outerHTML
    figureField.value.classList.add('grid__field--figure')
  }
}

const markFields = () => {
  setTimeout(() => {
    switch (figureName.value) {
      case IconEnum.bishop: markBishopFields()
        break
      case IconEnum.rook: markRookFields()
        break
      case IconEnum.queen: markQueenFields()
        break
      default: markKnightFields()
    }
    checkGameResult()
  }, 3000)
}

const checkGameResult = () => {
  setTimeout(() => {
    if (!playerFieldCoordinates.value) {
      return handleStop()
    }
    if (isPlayerCatched.value) {
      isGameOver.value = true
      setTimeout(() => {
        isGameOver.value = false
      }, 5000)
      return handleStop()
    }
    clearFields()
    handleStart()
  }, 3000)
}

const markBishopFields = () => {
  const { x, y } = figureFieldCoordinates.value as CoordinatesInterface
  const offsets = [1, 2, 3]
  markedFieldsCoordinates.value = offsets.reduce((coords: CoordinatesInterface[], offset: number) => {
    coords = [
      ...coords,
      { x: x + offset, y: y + offset },
      { x: x + offset, y: y - offset },
      { x: x - offset, y: y + offset },
      { x: x - offset, y: y - offset },
    ]
    return coords
  }, [])
  setMarkedFields()
}

const markRookFields = () => {
  const { x, y } = figureFieldCoordinates.value as CoordinatesInterface
  const offsets = [1, 2, 3]
  markedFieldsCoordinates.value = offsets.reduce((coords: CoordinatesInterface[], offset: number) => {
    coords = [
      ...coords,
      { x, y: y + offset },
      { x, y: y - offset },
      { x: x + offset, y },
      { x: x - offset, y },
    ]
    return coords
  }, [])
  setMarkedFields()
}

const markQueenFields = () => {
  markRookFields()
  markBishopFields()
}

const markKnightFields = () => {
  const { x, y } = figureFieldCoordinates.value as CoordinatesInterface
  markedFieldsCoordinates.value = [
    { x: x + 2, y: y - 1 },
    { x: x + 2, y: y + 1 },
    { x: x - 2, y: y - 1 },
    { x: x - 2, y: y + 1 },
    { x: x + 1, y: y - 2 },
    { x: x + 1, y: y + 2 },
    { x: x - 1, y: y - 2 },
    { x: x - 1, y: y + 2 },
  ]
  setMarkedFields()
}

const setMarkedFields = () => {
  markedFields.value?.forEach((field: Element | null) => field?.classList.add('grid__field--marked'))
}

const clearFields = () => {
  clearMarkedFields()
  clearFigureField()
  clearPlayerField()
  gridFields.value.forEach(element => {
    element.innerHTML = ''
  });
  clearAllCoordinates()
  figureName.value = ''
  playerField.value = undefined
}

const clearAllCoordinates = () => {
  markedFieldsCoordinates.value = []
  playerFieldCoordinates.value = undefined
  figureFieldCoordinates.value = undefined
}

const clearMarkedFields = () => {
  gridFields.value.forEach(field => field.classList.remove('grid__field--marked'))
}

const clearFigureField = () => {
  if (figureField.value) {
    figureField.value.classList.remove('grid__field--figure')
    figureField.value.innerHTML = ''
  }
}

const clearPlayerField = () => {
  playerField.value && (playerField.value.innerHTML = '')
}

const setFigureName = () => {
  figureName.value = Object.values(IconEnum)[getRandomInt()]
}

const setFigureFieldCoordinates = () => {
  figureFieldCoordinates.value = { x: getRandomInt(), y: getRandomInt() }
}

const getRandomInt = (max: number = 4): number => {
  return Math.floor(Math.random() * max)
}

const getFieldElement = (fieldCoordinates: CoordinatesInterface): Element => {
  return document.querySelector(`.grid__field__${fieldCoordinates?.x}-${fieldCoordinates?.y}`) as Element
}

const getFigureElement = (name: IconEnum | string): Element => {
  return document.querySelector(`.figures__${name}`) as Element
}

const handleFieldSelect = async(fieldCoordinates: CoordinatesInterface) => {
  playerFieldCoordinates.value = fieldCoordinates
  clearPlayerField()
  playerField.value = getFieldElement(fieldCoordinates) as Element
  if (playerField.value) {
    const figure = await getFigureElement('player')?.outerHTML as string
    playerField.value.innerHTML = figure
  }
}
</script>

<template>
  <header>
    <h1>Avoid Figures</h1>
  </header>
  <main class="app-main">
    <Grid
      @field-select="handleFieldSelect"
      :disabled="!!markedFields.length"
      :game-over="isGameOver"
    />
    <Figures />
    <Actions
      v-if="!isPlaying"
      @start="handleStart"
      @stop="handleStop"
      :start-disabled="isPlaying"
    />
  </main>
</template>

<style scoped lang="scss">
.app-main {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  margin: 0 auto;
  max-width: 340px;
}
.actions {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0,0,0,0.8);
}
</style>

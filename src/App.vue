<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  IconEnum,
  LevelEnum,
  type CoordinatesInterface,
  type FigureInterface,
} from './types'

import Figures from './components/Figures.vue'
import Grid from './components/Grid.vue'
import Actions from './components/Actions.vue'

const playerFieldCoordinates = ref<CoordinatesInterface>()
const markedFieldsCoordinates = ref<CoordinatesInterface[]>([])
const playerField = ref<Element>()
const isPlaying = ref(false)
const isStopped = ref(false)
const isGameOver = ref(false)
const figures = ref<FigureInterface[]>()
const figuresCount = ref(LevelEnum.easy)

const gridFields = computed((): NodeListOf<Element> => document.querySelectorAll('.grid__field') || [])
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
  clearFiguresFields()
  setFigures()
  positionFigures()
  markFiguresMoves()
}

const handleStop = () => {
  markedFieldsCoordinates.value = []
  clearFields()
  isStopped.value = true
  isPlaying.value = false
}

const setFigures = () => {
  const figuresRange = [...Array(figuresCount.value).keys()]
  const randomFigures = figuresRange.reduce((figuresAccumulator, _) => {
    const figure = getRandomFigure()
    if (isCoordinatesTaken(figuresAccumulator, figure.coordinates)) {
      setFigures()
    }
    figuresAccumulator = [...figuresAccumulator, figure]
    return figuresAccumulator
  }, [] as FigureInterface[])
  figures.value = randomFigures
}

const isCoordinatesTaken = (figuresToCheck: FigureInterface[], coord: CoordinatesInterface) => {
  return figuresToCheck.some(({ coordinates: { x, y } }) => x === coord.x && y === coord.y)
}

const getRandomFigure = (): FigureInterface => {
  const coordinates = getRandomFigureCoordinates()
  const name = getRandomFigureName()

  return {
    name,
    coordinates,
    field: getFieldElement(coordinates),
    element: getFigureElement(name),
  }
}

const positionFigures = () => {
  figures.value?.forEach((figure) => {
    const { field, element } = figure
    if (field && element) {
      field.innerHTML = element.outerHTML
      field.classList.add('grid__field--figure')
    }
  })
}

const markFiguresMoves = () => {
  setTimeout(() => {
    figures.value?.forEach((figure) => {
      const { name, coordinates } = figure

      switch (name) {
        case IconEnum.bishop: markBishopFields(coordinates)
          break
        case IconEnum.rook: markRookFields(coordinates)
          break
        case IconEnum.queen: markQueenFields(coordinates)
          break
        default: markKnightFields(coordinates)
      }
    })
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

const markBishopFields = ({ x, y}: CoordinatesInterface) => {
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

const markRookFields = ({ x, y}: CoordinatesInterface) => {
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

const markQueenFields = (coordinates: CoordinatesInterface) => {
  markRookFields(coordinates)
  markBishopFields(coordinates)
}

const markKnightFields = ({ x, y}: CoordinatesInterface) => {
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
  clearFiguresFields()
  clearPlayerField()
  gridFields.value.forEach(element => {
    element.innerHTML = ''
  });
  clearAllCoordinates()
  playerField.value = undefined
}

const clearAllCoordinates = () => {
  markedFieldsCoordinates.value = []
  playerFieldCoordinates.value = undefined
}

const clearMarkedFields = () => {
  gridFields.value.forEach(field => field.classList.remove('grid__field--marked'))
}

const clearFiguresFields = () => {
  figures.value?.forEach((figure) => {
    const { field } = figure

    if (field) {
      field.classList.remove('grid__field--figure')
      field.innerHTML = ''
    }
  })
}

const clearPlayerField = () => {
  playerField.value && (playerField.value.innerHTML = '')
}

const getRandomFigureName = () => Object.values(IconEnum)[getRandomInt()]

const getRandomFigureCoordinates = () => ({ x: getRandomInt(), y: getRandomInt() })

const getRandomInt = (max: number = 4): number => Math.floor(Math.random() * max)

const getFieldElement = (fieldCoordinates: CoordinatesInterface): Element => document.querySelector(`.grid__field__${fieldCoordinates?.x}-${fieldCoordinates?.y}`) as Element

const getFigureElement = (name: IconEnum | string): Element => document.querySelector(`.figures__${name}`) as Element

const handleFieldSelect = async(fieldCoordinates: CoordinatesInterface) => {
  playerFieldCoordinates.value = fieldCoordinates
  clearPlayerField()
  playerField.value = getFieldElement(fieldCoordinates) as Element
  if (playerField.value) {
    const figure = await getFigureElement('player')?.outerHTML as string
    playerField.value.innerHTML = figure
  }
}

const setLevel = (level: LevelEnum) => {
  figuresCount.value = level
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
      @level="setLevel"
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

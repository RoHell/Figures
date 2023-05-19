<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  IconEnum,
  LevelEnum,
  MarkEnum,
  type CoordinatesInterface,
  type FigureInterface,
} from './types'

import Figures from './components/Figures.vue'
import Grid from './components/Grid.vue'
import Actions from './components/Actions.vue'

const INITIAL_GRID_COLS = 4
const INITIAL_FIGURES_COUNT = LevelEnum.easy

const playerFieldCoordinates = ref<CoordinatesInterface | null>(null)
const markedFieldsCoordinates = ref<CoordinatesInterface[]>([])
const playerField = ref<Element | null>(null)
const isPlaying = ref(false)
const isStopped = ref(false)
const gridCols = ref(INITIAL_GRID_COLS)
const figures = ref<FigureInterface[]>()
const figuresCount = ref(INITIAL_FIGURES_COUNT)

const gridFields = computed((): NodeListOf<Element> => document.querySelectorAll('.grid__field') || [])
const markedFields = computed(() => [...markedFieldsCoordinates.value].map((coord: CoordinatesInterface) => getFieldElement(coord)).filter(Boolean))
const figuresOffset = computed(() => Array.from({ length: gridCols.value - 1 }, (_, idx) => idx + 1))

const handleStart = () => {
  clearFields()
  isStopped.value = false
  isPlaying.value = true
  setFigures()
}

const handleStop = () => {
  clearFields()
  isStopped.value = true
  isPlaying.value = false
}

const setFigures = () => {
  const figuresRange = [...Array(figuresCount.value).keys()]
  const randomFigures = figuresRange.reduce((figuresAccumulator: FigureInterface[], _) => {
    const figure = getRandomFigure(figuresAccumulator)
    figuresAccumulator = [...figuresAccumulator, figure] as FigureInterface[]
    return figuresAccumulator
  },[])
  figures.value = randomFigures.filter(Boolean)
  if (figures.value.length === figuresCount.value) {
    positionFigures()
  } else {
    setFigures()
  }
}

const getRandomFigure = (figs: FigureInterface[] | null = null) => {
  const figuresToCkeck = figs && [...figs].filter(Boolean)
  const coordinates = getRandomFigureCoordinates()
  const name = getRandomFigureName()

  const randomFigure = {
    name,
    coordinates,
    field: getFieldElement(coordinates),
    element: getFigureElement(name),
  }

  if (!randomFigure || isCoordinatesTaken(figuresToCkeck, randomFigure.coordinates)) {
    getRandomFigure(figuresToCkeck)
  } else {
    return randomFigure
  }
}

const isCoordinatesTaken = (figuresToCheck: FigureInterface[] | null = null, coord: CoordinatesInterface) => {
  if (!figuresToCheck?.length) { return }
  return [...figuresToCheck]
    .filter(Boolean)
    .some(({ coordinates: { x, y } }) => x === coord.x && y === coord.y)
}

const positionFigures = () => {
  figures.value?.forEach((figure: FigureInterface) => {
    const { field, element } = figure
    if (field && element) {
      field.innerHTML = element.outerHTML
      field.classList.add('grid__field--figure')
    }
  })
  // markAndCheck(3000)
}

const markAndCheck = (timeout: number = 0) => {
  setTimeout(() => {
    figures.value?.forEach((figure) => {
      markFigureMoves(figure)
    })
    checkGameResult()
  }, timeout)
}

const markFigureMoves = (figure: FigureInterface, type: MarkEnum = MarkEnum.marked) => {
  const { name, coordinates } = figure
  switch (name) {
    case IconEnum.bishop:
      markBishopFields(coordinates, type)
      break
    case IconEnum.rook:
      markRookFields(coordinates, type)
      break
    case IconEnum.queen:
      markQueenFields(coordinates, type)
      break
    default:
      markKnightFields(coordinates, type)
  }
}

const isPlayerCatched = () => {
  if (!playerFieldCoordinates.value) { return false }

  return [...markedFieldsCoordinates.value].some(markedFieldCoordinates => {
    return isSameCoordinates(markedFieldCoordinates, playerFieldCoordinates.value as CoordinatesInterface)
  }) || false
}

const isSameCoordinates = (elementA: CoordinatesInterface, elementB: CoordinatesInterface): boolean => (elementA.x === elementB.x) && (elementA.y === elementB.y)

const checkGameResult = () => {
  setTimeout(async() => {
    if (!playerFieldCoordinates.value || isPlayerCatched()) {
      await handleStop()
    } else {
      await clearFields()
      handleStart()
    }
  }, 3000)
}

const markBishopFields = ({ x, y }: CoordinatesInterface, type: MarkEnum = MarkEnum.marked) => {
  const markedCoordinates = figuresOffset.value.reduce(
    (coords: CoordinatesInterface[], offset: number) => {
      coords = [
        ...coords,
        { x: x + offset, y: y + offset },
        { x: x + offset, y: y - offset },
        { x: x - offset, y: y + offset },
        { x: x - offset, y: y - offset },
      ]
      return coords
    },
    []
  )
  setMarkedFields(markedCoordinates, type)
}

const markRookFields = ({ x, y }: CoordinatesInterface, type: MarkEnum = MarkEnum.marked) => {
  const markedCoordinates = figuresOffset.value.reduce(
    (coords: CoordinatesInterface[], offset: number) => {
      coords = [
        ...coords,
        { x, y: y + offset },
        { x, y: y - offset },
        { x: x + offset, y },
        { x: x - offset, y },
      ]
      return coords
    },
    []
  )
  setMarkedFields(markedCoordinates, type)
}

const markQueenFields = (coordinates: CoordinatesInterface, type: MarkEnum = MarkEnum.marked) => {
  markRookFields(coordinates, type)
  markBishopFields(coordinates, type)
}

const markKnightFields = ({ x, y }: CoordinatesInterface, type: MarkEnum = MarkEnum.marked) => {
  const markedCoordinates = [
    { x: x + 2, y: y - 1 },
    { x: x + 2, y: y + 1 },
    { x: x - 2, y: y - 1 },
    { x: x - 2, y: y + 1 },
    { x: x + 1, y: y - 2 },
    { x: x + 1, y: y + 2 },
    { x: x - 1, y: y - 2 },
    { x: x - 1, y: y + 2 },
  ]
  setMarkedFields(markedCoordinates, type)
}

const setMarkedFields = (markedCoordinates: CoordinatesInterface[], type: MarkEnum = MarkEnum.marked) => {
  markedFieldsCoordinates.value = [...markedFieldsCoordinates.value, ...markedCoordinates]
  markedFields.value.forEach((field: Element) => {
    field.classList.add(`grid__field--${type}`)
  })
}

const clearFields = () => {
  clearMarkedFields()
  clearFiguresFields()
  clearPlayerField()
}

const clearMarkedFields = (type: MarkEnum = MarkEnum.marked) => {
  markedFields.value.forEach((field: Element) => {
    field.classList.remove(`grid__field--${type}`)
    if (type === MarkEnum.hint) { return }
    field.innerHTML = ''
  })
  markedFieldsCoordinates.value = []
}

const clearFiguresFields = () => {
  figures.value?.forEach((figure) => {
    figure.field?.classList.remove('grid__field--figure')
    figure.field.innerHTML = ''
  })
}

const clearPlayerField = () => {
  playerField.value && (playerField.value.innerHTML = '')
  playerFieldCoordinates.value = null
  playerField.value = null
}

const getRandomFigureName = () => Object.values(IconEnum)[getRandomInt()]

const getRandomFigureCoordinates = () => ({
  x: getRandomInt(gridCols.value),
  y: getRandomInt(gridCols.value),
})

const getRandomInt = (max: number = INITIAL_GRID_COLS): number => Math.floor(Math.random() * max)

const getFieldElement = (fieldCoordinates: CoordinatesInterface): Element => document.querySelector(`.grid__field__${fieldCoordinates?.x}-${fieldCoordinates?.y}`) as Element

const getFigureElement = (name: IconEnum | string): Element => document.querySelector(`.figures__${name}`) as Element

const handleFieldSelect = (fieldCoordinates: CoordinatesInterface) => {
  console.log()
  if (markedFields.value?.length) { return }
  const selectedFigure = figures.value?.find((figure: FigureInterface) => isSameCoordinates(fieldCoordinates, figure.coordinates))
  if (selectedFigure) {
    markFigureMoves(selectedFigure, MarkEnum.hint)
    setTimeout(() => {
      clearMarkedFields(MarkEnum.hint)
    }, 1000)
  } else {
    setPlayerField(fieldCoordinates)
  }
}

const setPlayerField = (fieldCoordinates: CoordinatesInterface) => {
  if (playerField.value) {
    clearPlayerField()
  }
  playerFieldCoordinates.value = fieldCoordinates
  playerField.value = getFieldElement(fieldCoordinates) as Element
  if (playerField.value) {
    const figure = getFigureElement('player')?.outerHTML as string
    playerField.value.innerHTML = figure
  }
}

const setLevel = (level: LevelEnum) => {
  figuresCount.value = level
}

const setGrid = (cols: number) => {
  gridCols.value = cols
}
</script>

<template>
  <header>
    <h1>Avoid Figures</h1>
  </header>
  <main class="avoid-figures">
    <Grid
      @field="handleFieldSelect"
      :cols="gridCols"
    />
    <button
      v-if="isPlaying"
      type="button"
      class="avoid-figures__check"
      :disabled="!playerFieldCoordinates"
      v-text="'check'"
      @click="markAndCheck()"
    />
    <Figures />
    <Actions
      v-if="!isPlaying"
      @start="handleStart"
      @stop="handleStop"
      @level="setLevel"
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

  &__check {
    display: flex;
    margin: auto;
    text-transform: uppercase;
    border-radius: 0.25rem;
    border: 2px solid white;
    background-color: transparent;
    font-size: 1.25rem;
    padding: 1rem;
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

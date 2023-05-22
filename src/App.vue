<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  IconEnum,
  LevelEnum,
  type CoordinatesInterface,
  type FigureInterface,
} from './types'

import Figures from './components/Figures.vue'
import Grid from './components/Grid.vue'
import Actions from './components/Actions.vue'

const INITIAL_GRID_COLS = 4
const INITIAL_FIGURES_COUNT = LevelEnum.easy
const PLAYER_FIGURE_NAME = IconEnum.pawn

const playerFieldCoordinates = ref<CoordinatesInterface | null>(null)
const allFiguresMovesCoordinates = ref<CoordinatesInterface[]>([])
const playerField = ref<HTMLElement | null>(null)
const isPlaying = ref(false)
const isStopped = ref(false)
const gridCols = ref(INITIAL_GRID_COLS)
const figures = ref<FigureInterface[]>()
const figuresCount = ref(INITIAL_FIGURES_COUNT)
const selectedFigure = ref<FigureInterface>()

const gridFields = computed((): NodeListOf<HTMLElement> => document.querySelectorAll('.grid__field') || [])
const markedFields = computed(() => [...allFiguresMovesCoordinates.value]
  .map((coord: CoordinatesInterface) => getFieldElement(coord))
  .filter(Boolean)
)
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
  }, [])

  figures.value = randomFigures.filter(Boolean)

  if (figures.value.length === figuresCount.value) {
    positionFigures()
  } else {
    setFigures()
  }
}

const getRandomFigure = (figs: FigureInterface[] = []) => {
  const figuresToCheck = [...figs].filter(Boolean)
  const coordinates = getRandomFigureCoordinates()
  const name = getRandomFigureName()

  const randomFigure = {
    name,
    coordinates,
    field: getFieldElement(coordinates),
    element: getFigureElement(name),
  }

  if (!randomFigure || isCoordinatesTaken(figuresToCheck, randomFigure.coordinates)) {
    getRandomFigure(figuresToCheck)
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

const isEmptyField = (): boolean => {
  return Array.from(gridFields.value).some((field: HTMLElement) => {
    return !(field.dataset.figure_field || field.dataset.marked)
  })
}

const positionFigures = () => {
  figures.value?.forEach((figure: FigureInterface) => {
    const { field, element, name } = figure
    if (field && element) {
      field.dataset.figure_field = name
      field.innerHTML = element.outerHTML
      field.classList.add('grid__field--figure')
    }
    setFigureMovesCoordinates(figure)
  })
  setMarkedFields({ class: false })

  if (!isEmptyField()) {
    clearMarkedFields({ content: false })
    clearFiguresFields()
    setFigures()
  }
  // markAndCheck(3000)
}

const markAndCheck = (timeout: number = 0) => {
  setTimeout(() => {
    figures.value?.forEach((figure) => {
      setFigureMovesCoordinates(figure)
      setMarkedFields()
    })
    checkGameResult()
  }, timeout)
}

const setFigureMovesCoordinates = (figure: FigureInterface) => {
  const { name, coordinates } = figure
  switch (name) {
    case IconEnum.bishop:
      setBishopMovesCoordinates(coordinates)
      break
    case IconEnum.rook:
      setRookMovesCoordinates(coordinates)
      break
    case IconEnum.queen:
      setQueenMovesCoordinates(coordinates)
      break
    default:
      setKnightMovesCoordinates(coordinates)
  }
}

const isPlayerCatched = (): boolean => {
  if (!playerFieldCoordinates.value) { return false }

  return (
    [...allFiguresMovesCoordinates.value].some((figureMovesCoordinates: CoordinatesInterface): boolean => {
      return isSameCoordinates(figureMovesCoordinates, playerFieldCoordinates.value as CoordinatesInterface)
    }) || false
  )
}

const isSameCoordinates = (elementA: CoordinatesInterface, elementB: CoordinatesInterface): boolean => (elementA.x === elementB.x) && (elementA.y === elementB.y)

const checkGameResult = () => {
  setTimeout(async () => {
    if (!playerFieldCoordinates.value || isPlayerCatched()) {
      await handleStop()
    } else {
      await clearFields()
      handleStart()
    }
  }, 3000)
}

const setBishopMovesCoordinates = ({ x, y }: CoordinatesInterface) => {
  const movesCoordinates = figuresOffset.value.reduce(
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
  setAllFigureMovesCoordinates(movesCoordinates)
}

const setRookMovesCoordinates = ({ x, y }: CoordinatesInterface) => {
  const movesCoordinates = figuresOffset.value.reduce(
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
  setAllFigureMovesCoordinates(movesCoordinates)
}

const setQueenMovesCoordinates = (coordinates: CoordinatesInterface) => {
  setRookMovesCoordinates(coordinates)
  setBishopMovesCoordinates(coordinates)
}

const setKnightMovesCoordinates = ({ x, y }: CoordinatesInterface) => {
  const movesCoordinates = [
    { x: x + 2, y: y - 1 },
    { x: x + 2, y: y + 1 },
    { x: x - 2, y: y - 1 },
    { x: x - 2, y: y + 1 },
    { x: x + 1, y: y - 2 },
    { x: x + 1, y: y + 2 },
    { x: x - 1, y: y - 2 },
    { x: x - 1, y: y + 2 },
  ]
  setAllFigureMovesCoordinates(movesCoordinates)
}

const setAllFigureMovesCoordinates = (movesCoordinates: CoordinatesInterface[]) => {
  allFiguresMovesCoordinates.value = [
    ...allFiguresMovesCoordinates.value,
    ...movesCoordinates,
  ]
}

const setMarkedFields = ({ class: addClass = true }: { class?: boolean } = {}) => {

  markedFields.value.forEach((field: HTMLElement) => {
    if (field.dataset.figure_field) { return }
    field.dataset.marked = 'true'
    if (addClass) {
      field.classList.add('grid__field--marked')
    }
  })
}

const removeClass = (className: string) => {

}

const clearFields = () => {
  clearMarkedFields()
  clearFiguresFields()
  clearPlayerField()
}

const clearMarkedFields = ({ class: removeClasses = true, content: removeContent = true }: { class?: boolean, content?: boolean } = {}) => {
  markedFields.value.forEach((field: HTMLElement) => {
    delete field.dataset.marked
    if (removeClasses) {
      field.classList.remove('grid__field--marked')
    }
    if (removeContent) {
      field.innerHTML = ''
    }
  })
  allFiguresMovesCoordinates.value = []
}

const clearFiguresFields = () => {
  Array.from(gridFields.value).forEach((field: HTMLElement) => {
    delete field?.dataset.figure_field
  })
  figures.value?.forEach((figure) => {
    delete figure.field?.dataset.figure_field
    figure.field?.classList.remove('grid__field--figure')
    figure.field.innerHTML = ''
  })
}

const clearPlayerField = () => {
  if (playerField.value) {
    playerField.value.innerHTML = ''
    delete playerField.value.dataset.player
    playerFieldCoordinates.value = null
    playerField.value = null
  }
}

const getRandomFigureName = (): IconEnum => Object.values(IconEnum)[getRandomInt()]

const getRandomFigureCoordinates = () => ({
  x: getRandomInt(gridCols.value),
  y: getRandomInt(gridCols.value),
})

const getRandomInt = (max: number = INITIAL_GRID_COLS): number => Math.floor(Math.random() * max)

const getFieldElement = (fieldCoordinates: CoordinatesInterface): HTMLElement => document.querySelector(`[data-x="${fieldCoordinates?.x}"][data-y="${fieldCoordinates?.y}"]`) as HTMLElement

const getFigureElement = (name: IconEnum | string): HTMLElement => document.querySelector(`[data-figure="${name}"`) as HTMLElement

const setPlayerField = (fieldCoordinates: CoordinatesInterface) => {
  if (playerField.value) {
    clearPlayerField()
  }
  playerFieldCoordinates.value = fieldCoordinates
  playerField.value = getFieldElement(fieldCoordinates) as HTMLElement
  playerField.value.dataset.player
  if (playerField.value) {
    const figure = getFigureElement(PLAYER_FIGURE_NAME)?.outerHTML as string
    playerField.value.innerHTML = figure
  }
}

const setLevel = (level: LevelEnum) => {
  figuresCount.value = level
}

const setGrid = (cols: number) => {
  gridCols.value = cols
}

const handleMouseDown = (fieldCoordinates: CoordinatesInterface) => {
  selectedFigure.value = figures.value?.find((figure: FigureInterface) => isSameCoordinates(fieldCoordinates, figure.coordinates))

  if (selectedFigure.value) {
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
    <Grid @up="handleMouseUp" @down="handleMouseDown" :cols="gridCols" />
    <div v-if="isPlaying" class="avoid-figures__controls">
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
        @click="markAndCheck()"
      />
    </div>
    <Figures />
    <Actions
      v-if="!isPlaying"
      @start="handleStart"
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

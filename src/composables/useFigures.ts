import { computed, ref } from 'vue'

import {
  IconEnum,
  FigureEnum,
  LevelEnum,
  type FigureInterface,
} from '../types'

import useGrid from './useGrid'
import useCoordinates from './useCoordinates'
import useMarkedFields from './useMarkedFields'

import { getRandomInt } from '../utils'

const { gridCols, gridFields, isEmptyField, getGridElement } = useGrid()
const { setFigureMovesCoordinates, isCoordinatesTaken } = useCoordinates()
const { setMarkedFields, clearMarkedFields } = useMarkedFields()

const INITIAL_FIGURES_COUNT = LevelEnum.easy
const figuresCount = ref(INITIAL_FIGURES_COUNT)

export default () => {
  const randomFiguresList = ref<FigureInterface[]>([])
  const selectedFigure = ref<FigureInterface>()
  
  const figuresRange = computed((): number[] => [...Array(figuresCount.value).keys()])

  const setRandomFiguresList = () => {
    randomFiguresList.value = figuresRange.value
      .reduce((figures: FigureInterface[], _) => [...figures, getRandomFigure(figures)] as FigureInterface[], [])
      .filter(Boolean)

    if (randomFiguresList.value.length === figuresCount.value) {
      positionFigures()
    } else {
      setRandomFiguresList()
    }
  }

  const getRandomFigure = (figures: FigureInterface[] = []) => {
    const figuresToCheck = figures.filter(Boolean)
    const coordinates = getRandomFigureCoordinates()
    const name = getRandomFigureName()

    if (isCoordinatesTaken(figuresToCheck, coordinates)) {
      getRandomFigure(figuresToCheck)
    } else {
      return {
        name,
        coordinates,
        field: getGridElement(coordinates),
        element: getFigureElement(name),
      }
    }
  }

  const positionFigures = () => {
    randomFiguresList.value?.forEach((figure: FigureInterface) => {
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
      clearRandomFiguresList()
      setRandomFiguresList()
    }
    // markAndCheck(3000)
  }

  const clearRandomFiguresList = () => {
    Array.from(gridFields.value).forEach((field: HTMLElement) => {
      delete field?.dataset.figure_field
    })
    randomFiguresList.value?.forEach((figure) => {
      delete figure.field?.dataset.figure_field
      figure.field?.classList.remove('grid__field--figure')
      figure.field.innerHTML = ''
    })
  }

  const getRandomFigureName = (): FigureEnum => Object.values(FigureEnum)[getRandomInt(Object.values(FigureEnum).length)]
  
  const getRandomFigureCoordinates = () => ({
    x: getRandomInt(gridCols.value),
    y: getRandomInt(gridCols.value),
  })

  const getFigureElement = (name: IconEnum | string): HTMLElement => document.querySelector(`[data-figure="${name}"`) as HTMLElement

  const setFiguresCount = (level: LevelEnum) => {
    figuresCount.value = level
  }

  return {
    randomFiguresList,
    figuresCount,
    selectedFigure,
    figuresRange,
    setRandomFiguresList,
    clearRandomFiguresList,
    getFigureElement,
    setFiguresCount,
  }
}
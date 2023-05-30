import { ref, computed } from 'vue'

import {
  GridSizeEnum,
  type CoordinatesInterface,
  type GridInterface,
} from '../types'

const INITIAL_GRID_SIZE = GridSizeEnum.four

const gridSize = ref<GridSizeEnum>(INITIAL_GRID_SIZE)

const hasEmptyField = ref(false)

const hasMarkedField = ref(false)

export default () => {

  const gridSizes = computed(()  => Object.values(GridSizeEnum).filter(key => Number(key)))
  
  const grids = computed((): GridInterface[] => {
    return gridSizes.value.map((value) => ({
      name: `${value} x ${value}`,
      count: value as GridSizeEnum,
    }))
  })

  const gridFields = computed((): NodeListOf<HTMLElement> => document.querySelectorAll('.grid__field') || [])
 
  const currentGridIndex = computed((): number => grids.value.findIndex(grid => grid.count === gridSize.value))

  const currentGridCount = computed((): GridSizeEnum => {
    return gridSize.value < grids.value[grids.value.length - 1]?.count
      ? grids.value[currentGridIndex.value + 1]?.count
      : grids.value[0].count
  })

  const setGridSize = (cols: GridSizeEnum) => {
    gridSize.value = cols
  }

  const verifyEmptyField = () => {
    hasEmptyField.value = Array.from(gridFields.value).some((field: HTMLElement) => !(field.dataset.piece_field || field.dataset.marked))
    hasMarkedField.value = Array.from(gridFields.value).some((field: HTMLElement) => field.dataset.marked)
  }
  
  const getGridElement = (fieldCoordinates: CoordinatesInterface): HTMLElement => document.querySelector(`[data-x="${fieldCoordinates?.x}"][data-y="${fieldCoordinates?.y}"]`) as HTMLElement

  return {
    INITIAL_GRID_SIZE,
    grids,
    gridSize,
    gridFields,
    setGridSize,
    hasEmptyField,
    hasMarkedField,
    getGridElement,
    currentGridCount,
    verifyEmptyField,
  }
}
import { ref, computed } from 'vue'

import {
  GridSizeEnum,
  type CoordinatesInterface,
} from '../types'

const INITIAL_GRID_SIZE = 4
const GRIDS = [
  {
    name: '4 x 4',
    count: GridSizeEnum.four,
  },
  {
    name: '6 x 6',
    count: GridSizeEnum.six,
  },
  {
    name: '8 x 8',
    count: GridSizeEnum.eight,
  },
]
const gridSize = ref<GridSizeEnum>(INITIAL_GRID_SIZE)
const isEmptyField = ref(false)

export default () => {
  const gridFields = computed((): NodeListOf<HTMLElement> => document.querySelectorAll('.grid__field') || [])
 
  const setGridSize = (cols: GridSizeEnum) => {
    gridSize.value = cols
  }

  const verifyEmptyField = () => {
    isEmptyField.value = Array.from(gridFields.value).some((field: HTMLElement) => !(field.dataset.figure_field || field.dataset.marked))
  }
  
  const getGridElement = (fieldCoordinates: CoordinatesInterface): HTMLElement => document.querySelector(`[data-x="${fieldCoordinates?.x}"][data-y="${fieldCoordinates?.y}"]`) as HTMLElement

  return {
    INITIAL_GRID_SIZE,
    GRIDS,
    gridSize,
    gridFields,
    setGridSize,
    verifyEmptyField,
    isEmptyField,
    getGridElement,
  }
}
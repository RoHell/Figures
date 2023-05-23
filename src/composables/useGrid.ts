import { ref, computed } from 'vue'

import {
  type CoordinatesInterface,
} from '../types'

const INITIAL_GRID_COLS = 4
const gridCols = ref(INITIAL_GRID_COLS)
const isEmptyField = ref(false)

export default () => {
  const gridFields = computed((): NodeListOf<HTMLElement> => document.querySelectorAll('.grid__field') || [])
 
  const setGrid = (cols: number) => {
    gridCols.value = cols
  }

  const verifyEmptyField = () => {
    isEmptyField.value = Array.from(gridFields.value).some((field: HTMLElement) => !(field.dataset.figure_field || field.dataset.marked))
  }
  
  const getGridElement = (fieldCoordinates: CoordinatesInterface): HTMLElement => document.querySelector(`[data-x="${fieldCoordinates?.x}"][data-y="${fieldCoordinates?.y}"]`) as HTMLElement

  return {
    INITIAL_GRID_COLS,
    gridCols,
    gridFields,
    setGrid,
    verifyEmptyField,
    isEmptyField,
    getGridElement,
  }
}
import { computed } from 'vue'

import {
  type CoordinatesInterface,
} from '../types'

import useCoordinates from './useCoordinates'
import useGrid from './useGrid'

export default () => {
  const { allFiguresMovesCoordinates } = useCoordinates()
  const { getGridElement } = useGrid()
  
  const markedFields = computed(() => allFiguresMovesCoordinates.value.map((coord: CoordinatesInterface) => getGridElement(coord)).filter(Boolean))
  
  const setMarkedFields = ({ addMarkedClass = true }: { addMarkedClass?: boolean } = {}) => {
    markedFields.value.forEach((field: HTMLElement) => {
      if (field.dataset.figure_field) { return }
      field.dataset.marked = 'true'
      if (addMarkedClass) {
        field.classList.add('grid__field--marked')
      }
    })
  }

  const clearMarkedFields = () => {
    markedFields.value.forEach((field: HTMLElement) => {
      delete field.dataset.marked
      field.classList.remove('grid__field--marked')
    })
    allFiguresMovesCoordinates.value = []
  }

  return {
    setMarkedFields,
    clearMarkedFields,
  }
}
import { computed } from 'vue'

import {
  type CoordinatesInterface,
} from '../types'

import useCoordinates from './useCoordinates'
import useGrid from './useGrid'

export default () => {
  const { allPiecesMovesCoordinates } = useCoordinates()
  const { getGridElement } = useGrid()
  
  const markedFields = computed(() => allPiecesMovesCoordinates.value.map((coord: CoordinatesInterface) => getGridElement(coord)).filter(Boolean))
  
  const setMarkedFields = ({ addMarkedClass = true }: { addMarkedClass?: boolean } = {}) => {
    markedFields.value.forEach((field: HTMLElement) => {
      if (field.dataset.piece_field) { return }
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
    allPiecesMovesCoordinates.value = []
  }

  return {
    setMarkedFields,
    clearMarkedFields,
  }
}
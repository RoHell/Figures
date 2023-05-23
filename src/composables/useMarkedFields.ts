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
  
  const setMarkedFields = ({ class: addClass = true }: { class?: boolean } = {}) => {
    markedFields.value.forEach((field: HTMLElement) => {
      if (field.dataset.figure_field) { return }
      field.dataset.marked = 'true'
      if (addClass) {
        field.classList.add('grid__field--marked')
      }
    })
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

  return {
    setMarkedFields,
    clearMarkedFields,
  }
}
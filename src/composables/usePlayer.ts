import { ref } from 'vue'

import {
  IconEnum,
  type CoordinatesInterface,
} from '../types'

import useCoordinates from './useCoordinates'
import useGrid from './useGrid'
import useFigures from './useFigures'

const PLAYER_FIGURE_NAME = IconEnum.pawn

export default () => {
  const {
    playerFieldCoordinates,
    allFiguresMovesCoordinates,
    isSameCoordinates,
  } = useCoordinates()

  const { getGridElement } = useGrid()

  const { getFigureElement } = useFigures()

  const playerField = ref<HTMLElement | null>(null)

  const isPlayerCatched = (): boolean => {
    if (!playerFieldCoordinates.value) { return false }
  
    return (
      [...allFiguresMovesCoordinates.value].some((figureMovesCoordinates: CoordinatesInterface): boolean => {
        return isSameCoordinates(figureMovesCoordinates, playerFieldCoordinates.value as CoordinatesInterface)
      }) || false
    )
  }

  const clearPlayerField = () => {
    if (playerField.value) {
      playerField.value.innerHTML = ''
      playerFieldCoordinates.value = null
      playerField.value = null
    }
  }
  
  const setPlayerField = (fieldCoordinates: CoordinatesInterface) => {
    if (playerField.value) {
      clearPlayerField()
    }
    playerFieldCoordinates.value = fieldCoordinates
    playerField.value = getGridElement(fieldCoordinates)
    if (playerField.value) {
      const figure = getFigureElement(PLAYER_FIGURE_NAME)?.outerHTML
      playerField.value.innerHTML = figure
    }
  }

  return {
    isPlayerCatched,
    clearPlayerField,
    setPlayerField,
  }
}
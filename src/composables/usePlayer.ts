import { ref } from 'vue'

import {
  IconEnum,
  type CoordinatesInterface,
} from '../types'

import useCoordinates from './useCoordinates'
import useGrid from './useGrid'
import usePieces from './usePieces'

const PLAYER_FIGURE_NAME = IconEnum.pawn

export default () => {
  const {
    playerFieldCoordinates,
    allPiecesMovesCoordinates,
    isSameCoordinates,
  } = useCoordinates()

  const { getGridElement } = useGrid()

  const { getPieceElement } = usePieces()

  const playerField = ref<HTMLElement | null>(null)

  const isPlayerCatched = (): boolean => {
    if (!playerFieldCoordinates.value) { return false }
  
    return (
      [...allPiecesMovesCoordinates.value].some((pieceMovesCoordinates: CoordinatesInterface): boolean => {
        return isSameCoordinates(pieceMovesCoordinates, playerFieldCoordinates.value as CoordinatesInterface)
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
      const piece = getPieceElement(PLAYER_FIGURE_NAME)?.outerHTML
      playerField.value.innerHTML = piece
    }
  }

  return {
    isPlayerCatched,
    clearPlayerField,
    setPlayerField,
  }
}
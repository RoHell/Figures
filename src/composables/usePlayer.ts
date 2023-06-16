import { computed, ref } from 'vue'

import {
  IconEnum,
  type CoordinatesInterface,
} from '../types'

import useCoordinates from './useCoordinates'
import useGrid from './useGrid'
import usePieces from './usePieces'

const PLAYER_FIGURE_NAME = IconEnum.pawn
const isPlayerCaptured = ref(false)

export default () => {
  const {
    playerFieldCoordinates,
    allPiecesMovesCoordinates,
    isSameCoordinates,
  } = useCoordinates()

  const { getGridElement } = useGrid()

  const { getPieceElement } = usePieces()

  const playerField = ref<HTMLElement | null>(null)

  const isPlayerFail = computed(() => !playerFieldCoordinates.value || isPlayerCaptured.value)

  const checkPlayerStatus = () => {
    if (!playerFieldCoordinates.value) { return false }

    isPlayerCaptured.value = [...allPiecesMovesCoordinates.value]
      .some((pieceMovesCoordinates: CoordinatesInterface): boolean => {
        return isSameCoordinates(pieceMovesCoordinates, playerFieldCoordinates.value as CoordinatesInterface)
      }) || false

    if (isPlayerCaptured.value) {
      playerField.value?.classList.add('grid__field--killed')
    }
  }

  const clearPlayerField = () => {
    if (playerField.value) {
      playerField.value?.classList.remove('grid__field--killed')
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
    checkPlayerStatus,
    clearPlayerField,
    setPlayerField,
    playerField,
    isPlayerCaptured,
    isPlayerFail,
  }
}
import { computed, ref } from 'vue'

import {
  IconEnum,
  PieceEnum,
  type PieceInterface,
} from '../types'

import useGrid from './useGrid'
import useCoordinates from './useCoordinates'
import useMarkedFields from './useMarkedFields'
import { useStatus } from '../composables'

import { getRandomInt, arrayFromLength } from '../utils'

const INITIAL_PIECES_COUNT = 1

const piecesCount = ref(INITIAL_PIECES_COUNT)

export default () => {
  const {
    gridSize,
    gridFields,
    hasEmptyField,
    hasMarkedField,
    getGridElement,
    verifyEmptyField,
  } = useGrid()

  const {
    setPieceMovesCoordinates,
    isCoordinatesTaken,
  } = useCoordinates()

  const {
    setMarkedFields,
    clearMarkedFields,
  } = useMarkedFields()

  const { isSelectingPieces } = useStatus()
  
  const randomPiecesList = ref<PieceInterface[]>([])
  const selectedPiece = ref<PieceInterface>()

  const setRandomPiecesList = async () => {
    isSelectingPieces.value = true
    randomPiecesList.value = [...Array(piecesCount.value).keys()]
      .reduce((pieces: PieceInterface[], _) => [...pieces, getRandomPiece(pieces)] as PieceInterface[], [])
      .filter(Boolean)

    if (randomPiecesList.value.length === piecesCount.value) {
      await positionPieces()
    } else {
      await setRandomPiecesList()
    }
  }

  const getRandomPiece = (pieces: PieceInterface[] = []) => {
    const piecesToCheck = pieces.filter(Boolean)
    const coordinates = getRandomPieceCoordinates()
    const name = getRandomPieceName()

    if (isCoordinatesTaken(piecesToCheck, coordinates)) {
      getRandomPiece(piecesToCheck)
    } else {
      return {
        name,
        coordinates,
        field: getGridElement(coordinates),
        element: getPieceElement(name),
      }
    }
  }

  const positionPieces = async() => {
    randomPiecesList.value?.forEach((piece: PieceInterface) => {
      const { field, element, name } = piece
      if (field && element) {
        field.dataset.piece_field = name
        field.innerHTML = element.outerHTML
        field.classList.add('grid__field--piece')
      }
      setPieceMovesCoordinates(piece)
    })
    setMarkedFields({ addMarkedClass: false })
    verifyEmptyField()
    if (!hasEmptyField.value || (hasEmptyField.value && !hasMarkedField.value)) {
      clearMarkedFields()
      await clearRandomPiecesList()
      await setRandomPiecesList()
    } else {
      isSelectingPieces.value = false
    }
  }

  const clearRandomPiecesList = () => {
    Array.from(gridFields.value).forEach((field: HTMLElement) => {
      delete field?.dataset.piece_field
    })
    randomPiecesList.value?.forEach((piece) => {
      delete piece.field?.dataset.piece_field
      piece.field?.classList.remove('grid__field--piece')
      piece.field.innerHTML = ''
    })
    randomPiecesList.value = []
  }

  const getRandomPieceName = (): PieceEnum => Object.values(PieceEnum)[getRandomInt(Object.values(PieceEnum).length)]
  
  const getRandomPieceCoordinates = () => ({
    x: getRandomInt(gridSize.value),
    y: getRandomInt(gridSize.value),
  })

  const getPieceElement = (name: IconEnum | string): HTMLElement => document.querySelector(`[data-piece="${name}"`) as HTMLElement

  const setPiecesCount = (count: number) => {
    piecesCount.value = count
  }

  const maxPiecesCount = computed((): number => Math.floor(gridSize.value*gridSize.value / 3))

  const piecesRange = computed((): number[] => arrayFromLength(maxPiecesCount.value))

  return {
    INITIAL_PIECES_COUNT,
    randomPiecesList,
    piecesCount,
    selectedPiece,
    maxPiecesCount,
    piecesRange,
    isSelectingPieces,
    setRandomPiecesList,
    clearRandomPiecesList,
    getPieceElement,
    setPiecesCount,
  }
}

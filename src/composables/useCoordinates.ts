import { computed, ref } from 'vue'

import {
  IconEnum,
  type CoordinatesInterface,
  type PieceInterface,
  type PieceMovesCoordinates,
} from '../types'

import { arrayFromLength } from '../utils'

import {
  useGrid,
} from '../composables'

const allPiecesMovesCoordinates = ref<CoordinatesInterface[]>([])
const playerFieldCoordinates = ref<CoordinatesInterface | null>(null)
const piecesMovesCoordinates = ref<PieceMovesCoordinates[]>([])

export default () => {
  const { gridSize } = useGrid()

  const offset = computed((): number[] => arrayFromLength(gridSize.value - 1))

  const setPieceMovesCoordinates = (piece: PieceInterface) => {
    const { name, coordinates } = piece
    switch (name) {
      case IconEnum.bishop:
        setBishopMovesCoordinates(coordinates)
        break
      case IconEnum.rook:
        setRookMovesCoordinates(coordinates)
        break
      case IconEnum.queen:
        setQueenMovesCoordinates(coordinates)
        break
      default:
        setKnightMovesCoordinates(coordinates)
    }
  }

  const setBishopMovesCoordinates = (coordinates: CoordinatesInterface) => {
    const { x, y } = coordinates
    const movesCoordinates = offset.value?.reduce(
      (coords: CoordinatesInterface[], offset: number) => {
        coords = [
          ...coords,
          { x: x + offset, y: y + offset },
          { x: x + offset, y: y - offset },
          { x: x - offset, y: y + offset },
          { x: x - offset, y: y - offset },
        ]
        return coords
      },
      []
    )
    setAllPieceMovesCoordinates({ origin: coordinates, movesCoordinates })
  }
  
  const setRookMovesCoordinates = (coordinates: CoordinatesInterface) => {
    const { x, y } = coordinates
    const movesCoordinates = offset.value?.reduce(
      (coords: CoordinatesInterface[], offset: number) => {
        coords = [
          ...coords,
          { x, y: y + offset },
          { x, y: y - offset },
          { x: x + offset, y },
          { x: x - offset, y },
        ]
        return coords
      },
      []
    )
    setAllPieceMovesCoordinates({ origin: coordinates, movesCoordinates })
  }
  
  const setQueenMovesCoordinates = (coordinates: CoordinatesInterface) => {
    setRookMovesCoordinates(coordinates)
    setBishopMovesCoordinates(coordinates)
  }
  
  const setKnightMovesCoordinates = (coordinates: CoordinatesInterface) => {
    const { x, y } = coordinates
    const movesCoordinates = [
      { x: x + 2, y: y - 1 },
      { x: x + 2, y: y + 1 },
      { x: x - 2, y: y - 1 },
      { x: x - 2, y: y + 1 },
      { x: x + 1, y: y - 2 },
      { x: x + 1, y: y + 2 },
      { x: x - 1, y: y - 2 },
      { x: x - 1, y: y + 2 },
    ]
    setAllPieceMovesCoordinates({ origin: coordinates, movesCoordinates })
  }

  const isCoordinatesTaken = (piecesToCheck: PieceInterface[] = [], coord: CoordinatesInterface) => {
    return piecesToCheck
      .filter(Boolean)
      .some(({ coordinates: { x, y } }) => x === coord?.x && y === coord?.y)
  }

  const isSameCoordinates = (elementA: CoordinatesInterface, elementB: CoordinatesInterface): boolean => (elementA?.x === elementB?.x) && (elementA?.y === elementB?.y)

  const setAllPieceMovesCoordinates = ({ origin, movesCoordinates }: PieceMovesCoordinates) => {
    piecesMovesCoordinates.value = [
      ...piecesMovesCoordinates.value,
      {
        origin,
        movesCoordinates,
      }
    ]

    allPiecesMovesCoordinates.value = [
      ...allPiecesMovesCoordinates.value,
      ...movesCoordinates,
    ]
  }

  const clearPiecesMovesCoordinates = () => {
    piecesMovesCoordinates.value = []
  }

  return {
    setPieceMovesCoordinates,
    allPiecesMovesCoordinates,
    playerFieldCoordinates,
    isCoordinatesTaken,
    isSameCoordinates,
    piecesMovesCoordinates,
    clearPiecesMovesCoordinates,
  }
}

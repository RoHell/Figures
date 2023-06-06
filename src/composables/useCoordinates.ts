import { computed, ref } from 'vue'

import {
  IconEnum,
  type CoordinatesInterface,
  type PieceInterface,
} from '../types'

import { arrayFromLength } from '../utils'

import useGrid from './useGrid'

const allPiecesMovesCoordinates = ref<CoordinatesInterface[]>([])
const playerFieldCoordinates = ref<CoordinatesInterface | null>(null)

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

  const setBishopMovesCoordinates = ({ x, y }: CoordinatesInterface) => {
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
    setAllPieceMovesCoordinates(movesCoordinates)
  }
  
  const setRookMovesCoordinates = ({ x, y }: CoordinatesInterface) => {
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
    setAllPieceMovesCoordinates(movesCoordinates)
  }
  
  const setQueenMovesCoordinates = (coordinates: CoordinatesInterface) => {
    setRookMovesCoordinates(coordinates)
    setBishopMovesCoordinates(coordinates)
  }
  
  const setKnightMovesCoordinates = ({ x, y }: CoordinatesInterface) => {
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
    setAllPieceMovesCoordinates(movesCoordinates)
  }
  
  const setAllPieceMovesCoordinates = (movesCoordinates: CoordinatesInterface[]) => {
    allPiecesMovesCoordinates.value = [
      ...allPiecesMovesCoordinates.value,
      ...movesCoordinates,
    ]
  }

  const isCoordinatesTaken = (piecesToCheck: PieceInterface[] = [], coord: CoordinatesInterface) => {
    return piecesToCheck
      .filter(Boolean)
      .some(({ coordinates: { x, y } }) => x === coord?.x && y === coord?.y)
  }

  const isSameCoordinates = (elementA: CoordinatesInterface, elementB: CoordinatesInterface): boolean => (elementA.x === elementB.x) && (elementA.y === elementB.y)

  return {
    setPieceMovesCoordinates,
    allPiecesMovesCoordinates,
    playerFieldCoordinates,
    isCoordinatesTaken,
    isSameCoordinates,
  }
}

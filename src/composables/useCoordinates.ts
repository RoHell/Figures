import { computed, ref } from 'vue'

import {
  IconEnum,
  type CoordinatesInterface,
  type FigureInterface,
} from '../types'

import useGrid from './useGrid'

const allFiguresMovesCoordinates = ref<CoordinatesInterface[]>([])
const playerFieldCoordinates = ref<CoordinatesInterface | null>(null)

export default () => {
  const { gridCols } = useGrid()
  

  const figuresOffset = computed((): number[] => Array.from({ length: gridCols.value - 1 }, (_, idx) => idx + 1))

  const setFigureMovesCoordinates = (figure: FigureInterface) => {
    const { name, coordinates } = figure
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
    const movesCoordinates = figuresOffset.value.reduce(
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
    setAllFigureMovesCoordinates(movesCoordinates)
  }
  
  const setRookMovesCoordinates = ({ x, y }: CoordinatesInterface) => {
    const movesCoordinates = figuresOffset.value.reduce(
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
    setAllFigureMovesCoordinates(movesCoordinates)
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
    setAllFigureMovesCoordinates(movesCoordinates)
  }
  
  const setAllFigureMovesCoordinates = (movesCoordinates: CoordinatesInterface[]) => {
    allFiguresMovesCoordinates.value = [
      ...allFiguresMovesCoordinates.value,
      ...movesCoordinates,
    ]
  }

  const isCoordinatesTaken = (figuresToCheck: FigureInterface[] = [], coord: CoordinatesInterface) => {
    return figuresToCheck
      .filter(Boolean)
      .some(({ coordinates: { x, y } }) => x === coord?.x && y === coord?.y)
  }

  const isSameCoordinates = (elementA: CoordinatesInterface, elementB: CoordinatesInterface): boolean => (elementA.x === elementB.x) && (elementA.y === elementB.y)

  return {
    setFigureMovesCoordinates,
    allFiguresMovesCoordinates,
    playerFieldCoordinates,
    isCoordinatesTaken,
    isSameCoordinates,
  }
}
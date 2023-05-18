export interface CoordinatesInterface {
  x: number,
  y: number,
}

export interface FigureInterface {
  name: string
  coordinates: CoordinatesInterface
  field: Element
  element: Element
}

export enum IconEnum {
  bishop = 'bishop',
  rook = 'rook',
  queen = 'queen',
  knight = 'knight',
  pawn = 'pawn',
  king = 'king',
}

export enum LevelEnum {
  easy = 1,
  hard,
  insane,
}
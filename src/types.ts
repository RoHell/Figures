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
  medium,
  hard,
  extreme = 6,
  insane = 8,
}

export interface LevelInterface {
  name: string,
  hardness: LevelEnum,
  emoji: string,
}

export enum GridColsEnum {
  four = 4,
  six = 6,
  eight = 8,
}

export enum MarkEnum {
  marked = 'marked',
  hint = 'hint',
}
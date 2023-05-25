export interface CoordinatesInterface {
  x: number,
  y: number,
}

export interface FigureInterface {
  name: string
  coordinates: CoordinatesInterface
  field: HTMLElement
  element: Element
}

export enum FigureEnum {
  bishop = 'bishop',
  rook = 'rook',
  queen = 'queen',
  knight = 'knight',
}

export enum IconEnum {
  bishop = 'bishop',
  rook = 'rook',
  queen = 'queen',
  knight = 'knight',
  pawn = 'pawn',
  king = 'king',
  more = 'more',
  close = 'close',
  settings = 'settings',
  back = 'back',
  grid = 'grid',
}

export enum LevelEnum {
  easy = 1,
  medium = 2,
  hard = 4,
  extreme = 6,
  insane = 10,
}

export interface LevelInterface {
  name: string,
  hardness: LevelEnum,
  emoji: string,
}

export enum GridSizeEnum {
  four = 4,
  six = 6,
  eight = 8,
}

export enum ConfigNameEnum {
  pieces = 'pieces',
  vibrations = 'vibrations',
  sounds = 'sounds',
  tips = 'tips',
}

export interface ConfigInterface {
  id: string,
  name: ConfigNameEnum,
  label: ConfigNameEnum | string,
}
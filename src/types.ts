export interface CoordinatesInterface {
  x: number,
  y: number,
}

export interface PieceInterface {
  name: string
  coordinates: CoordinatesInterface
  field: HTMLElement
  element: Element
}

export enum PieceEnum {
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

export enum GridSizeEnum {
  two = 2,
  three,
  four,
  five,
  six,
  seven,
  eight,
}

export interface GridInterface {
  name: string,
  count: GridSizeEnum,
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

export enum GameModeEnum {
  school = 'School',
  quest = 'Quest',
}
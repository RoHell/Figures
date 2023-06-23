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

export interface PieceMovesCoordinates {
  origin: CoordinatesInterface,
  movesCoordinates: CoordinatesInterface[],
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
  timer = 'timer',
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

export interface QuestStageInterface {
  grid: GridSizeEnum,
  pieces: number,
  fails?: number,
  killers?: PieceEnum[]
}

export enum LocalStorageEnum {
  QUEST_TEMP = 'quest-temp',
  QUEST = 'quest',
  QUEST_FAILS = 'quest-fails',
  QUEST_LOGS = 'quest-logs',
}

export enum QuestLogsEnum {
  KILLERS = 'killers',
  TIME = 'time',
  COUNTDOWN_TIME = 'countdown-time',
  FAILS = 'fails',
}

export interface QuestLogStorageInterface {
  [QuestLogsEnum.KILLERS]?: PieceEnum[],
  [QuestLogsEnum.TIME]?: Date[],
  [QuestLogsEnum.COUNTDOWN_TIME]?: Date[],
  [QuestLogsEnum.FAILS]?: QuestStageInterface[],
}

export interface QuestLog {
  name: QuestLogsEnum,
  value: QuestLogValueType,
}

export type QuestLogValueType = PieceEnum | Date | QuestStageInterface

export type QuestStorageType = {
  [n in QuestLogsEnum]?: QuestLogValueType[]
}

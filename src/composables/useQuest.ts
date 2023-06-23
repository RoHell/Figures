import { computed, onMounted, ref } from 'vue'

import {
  GameModeEnum,
  GridSizeEnum,
  LocalStorageEnum,
  PieceEnum,
  type QuestStageInterface,
} from '../types'

import {
  getParsedProxy
} from '../utils'

import {
  useGrid,
  usePieces,
  useStatus,
  useStorage,
} from '.'

const failedQuestStages = ref<QuestStageInterface[]>([])

export default () => {
  const {
    gameMode,
    isTempMode,
  } = useStatus()
  
  const {
    setStoredItem,
    getStoredItem,
    removeStoredItem,
  } = useStorage()
  
  const { INITIAL_GRID_SIZE } = useGrid()
  
  const { INITIAL_PIECES_COUNT } = usePieces()
  
  const INITIAL_QUEST_STAGE: QuestStageInterface = {
    grid: INITIAL_GRID_SIZE,
    pieces: INITIAL_PIECES_COUNT,
  }
  
  const INITIAL_FAILED_STAGE: QuestStageInterface = {
    ...INITIAL_QUEST_STAGE,
    fails: 0,
    killers: [],
  }


  const quest = ref<QuestStageInterface>(INITIAL_QUEST_STAGE)

  const isQuestMode = computed(() => gameMode.value === GameModeEnum.quest)

  const activeStorageQuestKey = computed(() => LocalStorageEnum.QUEST)

  const storedQuestKey = computed(() => {
    if (isTempMode.value) {
      return LocalStorageEnum.QUEST_TEMP
    } else {
      removeStoredItem(LocalStorageEnum.QUEST_TEMP)
      return activeStorageQuestKey.value
    }
  })

  const isActiveQuest = computed(() => {
    const { grid, pieces } = quest.value
    const { grid: activeGrid, pieces: activePieces } = activeStorageQuest()

    return (grid === activeGrid) && (pieces === activePieces)
  })

  const canContinue = computed((): boolean => {
    const { grid, pieces } = getStoredItem(storedQuestKey.value)
    return (grid > INITIAL_GRID_SIZE) || (pieces > INITIAL_PIECES_COUNT)
  })

  const failedQuestStage = computed((): QuestStageInterface | undefined => {
    const { grid, pieces } = quest.value
    return [...failedQuestStages.value].find((stage: QuestStageInterface) => stage.grid === grid && stage.pieces === pieces)
  })

  const failedQuestStageIndex = computed((): number => {
    const { grid, pieces } = quest.value
    return [...failedQuestStages.value].findIndex((stage: QuestStageInterface) => stage.grid === grid && stage.pieces === pieces)
  })

  const isStageInProgress = computed(() => {
    const { grid, pieces } = quest.value
    return (grid !== INITIAL_GRID_SIZE) || (pieces !== INITIAL_PIECES_COUNT) || getStoredItem(LocalStorageEnum.QUEST_FAILS)
  })

  const setStorageQuest = async({ grid = INITIAL_GRID_SIZE, pieces = INITIAL_PIECES_COUNT }: QuestStageInterface) => {
    const quest = { grid, pieces }
    await setStoredItem(storedQuestKey.value, quest)
    setQuest(quest)
  }

  const setStorageQuestFails = async(failedQuestStage: QuestStageInterface) => {
    if (failedQuestStageIndex.value > -1) {
      failedQuestStages.value.splice(failedQuestStageIndex.value, 1)
    }
    failedQuestStages.value = [...failedQuestStages.value, failedQuestStage]
    await setStoredItem(LocalStorageEnum.QUEST_FAILS, failedQuestStages.value)
  }

  const getStorageQuestFails = async() => await getStoredItem(LocalStorageEnum.QUEST_FAILS)

  const fetchStorageQuest = async() => {
    const storedQuest = await getStoredItem(storedQuestKey.value)
    if (storedQuest) {
      setQuest(storedQuest)
    } else {
      setStorageQuest(INITIAL_QUEST_STAGE)
    }
  }

  const setQuest = (questToSet: QuestStageInterface) => { 
    quest.value = questToSet
  }

  const activeStorageQuest = (): QuestStageInterface => {
    if (!getStoredItem(activeStorageQuestKey.value)) { setStorageQuest(INITIAL_QUEST_STAGE) }
    return getStoredItem(activeStorageQuestKey.value)
  }

  const totalFailsCount = computed((): number => failedQuestStages.value.reduce((acc: any, stage: QuestStageInterface = INITIAL_QUEST_STAGE) => {
    acc = acc + stage.fails
    return acc
  }, 0))

  const killersList = computed((): PieceEnum[] => failedQuestStages.value.reduce((acc: any, stage: QuestStageInterface = INITIAL_QUEST_STAGE) => {
    acc = [...acc, ...getParsedProxy(stage.killers)]
    return acc
  }, []))

  const getGridFails = (grid: GridSizeEnum): number => failedQuestStages.value.reduce((acc: any, stage: QuestStageInterface) => {
    if (stage.grid === grid) {
      acc = acc + (stage.fails || 0)
    }
    return acc
  }, 0)

  const getGridPieceFails = (grid: GridSizeEnum, pieceNumber: number): number => failedQuestStages.value.find((stage: QuestStageInterface) => {
    return (stage.grid === grid) && (stage.pieces === pieceNumber)
  })?.fails || 0

  const resetFailedQuestStages = async() => {
    failedQuestStages.value = await getStoredItem(LocalStorageEnum.QUEST_FAILS) || [INITIAL_FAILED_STAGE]
  }

  onMounted(async() => {
    await resetFailedQuestStages()
  })

  return {
    quest,
    failedQuestStages,
    isQuestMode,
    canContinue,
    INITIAL_QUEST_STAGE,
    activeStorageQuestKey,
    storedQuestKey,
    failedQuestStage,
    failedQuestStageIndex,
    totalFailsCount,
    isStageInProgress,
    isActiveQuest,
    killersList,
    setStorageQuest,
    fetchStorageQuest,
    activeStorageQuest,
    removeStoredItem,
    setStorageQuestFails,
    getStorageQuestFails,
    resetFailedQuestStages,
    getGridFails,
    getGridPieceFails,
  }
}
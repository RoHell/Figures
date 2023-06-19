import { computed, onBeforeMount, ref } from 'vue'

import {
  GameModeEnum,
  LocalStorageEnum,
  type QuestStageInterface,
} from '../types'

import {
  useGrid,
  usePieces,
  useStatus,
  useStorage,
} from '.'

const { INITIAL_GRID_SIZE } = useGrid()

const { INITIAL_PIECES_COUNT } = usePieces()
  
const INITIAL_QUEST_STAGE: QuestStageInterface = {
  grid: INITIAL_GRID_SIZE,
  pieces: INITIAL_PIECES_COUNT,
}

const INITIAL_FAILED_STAGE: QuestStageInterface = {
  ...INITIAL_QUEST_STAGE,
  fails: 0,
}

const failedQuestStages = ref<QuestStageInterface[]>([INITIAL_FAILED_STAGE])

export default () => {
  
  const {
    gameMode,
    isCountdownMode,
    isTempMode,
  } = useStatus()

  const {
    setStoredItem,
    getStoredItem,
    removeStoredItem,
  } = useStorage()

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

  const getStorageQuestFails = () => getStoredItem(LocalStorageEnum.QUEST_FAILS)

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

  const failedGrids = computed(() => [...failedQuestStages.value].reduce((acc: any, stage: QuestStageInterface = INITIAL_QUEST_STAGE) => {
    acc[stage.grid] = stage.fails
    return acc
  }, {}))

  const resetFailedQuestStages = async() => {
    failedQuestStages.value = await getStoredItem(LocalStorageEnum.QUEST_FAILS) || [INITIAL_FAILED_STAGE]
  }

  onBeforeMount(async() => {
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
    failedGrids,
    isStageInProgress,
    setStorageQuest,
    fetchStorageQuest,
    activeStorageQuest,
    removeStoredItem,
    setStorageQuestFails,
    getStorageQuestFails,
    resetFailedQuestStages,
  }
}
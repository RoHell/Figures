import { computed, ref } from 'vue'

import {
  GameModeEnum,
  type QuestInterface
} from '../types'

import {
  useGrid,
  usePieces,
  useStatus,
} from '.'

export default () => {
  const { INITIAL_GRID_SIZE } = useGrid()
  
  const { INITIAL_PIECES_COUNT } = usePieces()
  
  const INITIAL_QUEST = {
    grid: INITIAL_GRID_SIZE,
    pieces: INITIAL_PIECES_COUNT,
  }
  
  const { gameMode, isCountdownMode, isTempMode } = useStatus()

  const quest = ref<QuestInterface>(INITIAL_QUEST)

  const isQuestMode = computed(() => gameMode.value === GameModeEnum.quest)

  const activeStorageQuestKey = computed(() => isCountdownMode.value ? 'quest-countdown' : 'quest')

  const storedQuestKey = computed(() => {
    if (isTempMode.value) {
      return 'quest-temp'
    } else {
      removeStoredItem('quest-temp')
      return activeStorageQuestKey.value
    }
  })

  const canContinue = computed(() => {
    const { grid, pieces } = getParsedItem(storedQuestKey.value)
    return (grid > INITIAL_GRID_SIZE) || (pieces > INITIAL_PIECES_COUNT)
  })

  const setStorageQuest = async({ grid = INITIAL_GRID_SIZE, pieces = INITIAL_PIECES_COUNT }: QuestInterface) => {
    await localStorage.setItem(storedQuestKey.value, JSON.stringify({ grid, pieces }))
    setQuest({ grid, pieces })
  }

  const fetchStorageQuest = async() => {
    const storedQuest = await getParsedItem(storedQuestKey.value)
    if (storedQuest) {
      setQuest(storedQuest)
    } else {
      setStorageQuest(INITIAL_QUEST)
    }
  }

  const setQuest = (questToSet: QuestInterface) => { 
    quest.value = questToSet
  }

  const activeStorageQuest = (): QuestInterface => getParsedItem(activeStorageQuestKey.value)

  const getParsedItem = (key: 'quest-temp' | 'quest-countdown' | 'quest') => {
    const storedItem = localStorage.getItem(key)
    if (storedItem) {
      return JSON.parse(storedItem)
    }
  }

  const removeStoredItem = (key: 'quest-temp' | 'quest-countdown' | 'quest') => localStorage.removeItem(key)

  return {
    quest,
    isQuestMode,
    canContinue,
    INITIAL_QUEST,
    activeStorageQuestKey,
    storedQuestKey,
    setStorageQuest,
    fetchStorageQuest,
    activeStorageQuest,
    removeStoredItem,
    getParsedItem,
  }
}
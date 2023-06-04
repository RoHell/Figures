import { computed, reactive } from 'vue'

import {
  GameModeEnum,
} from '../types'

import {
  useGrid,
  usePieces,
  useStatus,
} from '.'

export default () => {
  const { INITIAL_GRID_SIZE } = useGrid()
  
  const { INITIAL_PIECES_COUNT } = usePieces()

  const { gameMode } = useStatus()

  const quest = reactive({
    grid: INITIAL_GRID_SIZE,
    pieces: INITIAL_PIECES_COUNT,
  })

  const isQuestMode = computed(() => gameMode.value === GameModeEnum.quest)

  return {
    quest,
    isQuestMode
  }
}
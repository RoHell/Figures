import { ref } from "vue"

import { GameModeEnum } from '../types'

const isPlaying = ref(false)
const isChecking = ref(false)
const isMenuOpen = ref(false)
const isStartingGame = ref(false)
const isCountdownMode = ref(true)
const countdownFrom = ref()
const gameMode = ref(GameModeEnum.quest)
const showPromptActions = ref(false)
const isTempMode = ref(false)
const showStatistics = ref(false)

export default () => {

  return {
    isPlaying,
    isChecking,
    isMenuOpen,
    isStartingGame,
    isCountdownMode,
    countdownFrom,
    gameMode,
    showPromptActions,
    isTempMode,
    showStatistics,
  }
}
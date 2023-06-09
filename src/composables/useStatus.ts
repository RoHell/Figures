import { ref } from "vue"

import { GameModeEnum } from '../types'

const isPlaying = ref(false)
const isChecking = ref(false)
const isMenuOpen = ref(false)
const isStartingGame = ref(false)
const isCountdownMode = ref(false)
const countdownFrom = ref()
const gameMode = ref(GameModeEnum.school)

export default () => {

  return {
    isPlaying,
    isChecking,
    isMenuOpen,
    isStartingGame,
    isCountdownMode,
    countdownFrom,
    gameMode,
  }
}
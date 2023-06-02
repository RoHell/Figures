import { ref } from "vue"

import { GameModeEnum } from '../types'

const isPlaying = ref(false)
const isChecking = ref(false)
const isMenuOpen = ref(false)
const isSelectingPieces = ref(false)
const isTimingOn = ref(false)
const timingValue = ref(5)
const gameMode = ref(GameModeEnum.school)

export default () => {

  return {
    isPlaying,
    isChecking,
    isMenuOpen,
    isSelectingPieces,
    isTimingOn,
    timingValue,
    gameMode,
  }
}
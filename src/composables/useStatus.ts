import { ref } from "vue"

const isPlaying = ref(false)
const isChecking = ref(false)
const isMenuOpen = ref(false)
const isSelectingPieces = ref(false)
const isTimingOn = ref(false)
const timingValue = ref(3)

export default () => {

  return {
    isPlaying,
    isChecking,
    isMenuOpen,
    isSelectingPieces,
    isTimingOn,
    timingValue,
  }
}
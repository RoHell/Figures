import { ref } from "vue"

const isPlaying = ref(false)
const isChecking = ref(false)
const isMenuOpen = ref(false)
const isSelectingPieces = ref(false)

export default () => {

  return {
    isPlaying,
    isChecking,
    isMenuOpen,
    isSelectingPieces,
  }
}
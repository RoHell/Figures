import { ref } from "vue"

const isPlaying = ref(false)
const isStopped = ref(false)
const isChecking = ref(false)
const isMenuOpen = ref(false)

export default () => {

  return {
    isPlaying,
    isStopped,
    isChecking,
    isMenuOpen,
  }
}
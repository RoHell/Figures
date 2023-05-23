import { ref } from "vue"

export default () => {
  const isPlaying = ref(false)
  const isStopped = ref(false)
  const isChecking = ref(false)

  return {
    isPlaying,
    isStopped,
    isChecking,
  }
}
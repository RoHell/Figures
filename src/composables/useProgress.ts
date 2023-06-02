import { computed, ref } from 'vue'

import { useStatus } from '../composables'

const { timingValue } = useStatus()

const timoutProgress = ref(1)

export default () => {
  const INTERVAL = 10
  let interval: string | number | NodeJS.Timer | undefined = undefined

  const isCounting = computed(() => timoutProgress.value > 0 && timoutProgress.value < 1)

  const countownTimer = () => {
    const progressDecrement = INTERVAL / (timingValue.value * 1000)
    if (timoutProgress.value <= 0) {
      timoutProgress.value = 1
      clearInterval(interval)
    }
    timoutProgress.value -= progressDecrement
  }

  const startCountdown = () => {
    if (interval) { return }
    interval = setInterval(countownTimer, INTERVAL)
  }

  const stopCountdown = () => {
    clearInterval(interval)
    interval = undefined
  }

  const resetProgress = () => {
    stopCountdown()
    timoutProgress.value = 1
  }

  return {
    startCountdown,
    stopCountdown,
    resetProgress,
    timoutProgress,
    isCounting
  }
}
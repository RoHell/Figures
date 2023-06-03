import { computed, ref } from 'vue'

import { GameModeEnum } from '../types'

import { useStatus, usePieces } from '../composables'

const { countdownFrom, gameMode } = useStatus()
const { piecesCount } = usePieces()

const countdownProgress = ref(1)

export default () => {
  const INTERVAL = 10
  let interval: string | number | NodeJS.Timer | undefined = undefined

  const isCountdownOn = computed(() => countdownProgress.value > 0 && countdownProgress.value < 1)

  const countdownTimer = () => {
    if (gameMode.value === GameModeEnum.quest) {
      countdownFrom.value = piecesCount.value
    }
    const progressDecrement = INTERVAL / (countdownFrom.value * 1000)

    if (countdownProgress.value <= 0) {
      countdownProgress.value = 1
      clearInterval(interval)
    }

    countdownProgress.value -= progressDecrement
  }

  const startCountdown = () => {
    if (interval) { return }
    interval = setInterval(countdownTimer, INTERVAL)
  }

  const stopCountdown = () => {
    clearInterval(interval)
    interval = undefined
  }

  const resetProgress = () => {
    stopCountdown()
    countdownProgress.value = 1
  }

  return {
    startCountdown,
    stopCountdown,
    resetProgress,
    countdownProgress,
    isCountdownOn
  }
}
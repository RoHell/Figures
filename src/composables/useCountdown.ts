import { computed, ref } from 'vue'

import { GameModeEnum } from '../types'

import { useStatus, usePieces } from '.'

const { countdownFrom, gameMode } = useStatus()
const { piecesCount } = usePieces()

const INITIAL_COUNTDOWN_VALUE: number = 1
const INITIAL_COUNTDOWN_FROM_VALUE: number = 5
const countdownProgress = ref<number>(INITIAL_COUNTDOWN_VALUE)
countdownFrom.value = INITIAL_COUNTDOWN_FROM_VALUE

export default () => {
  const INTERVAL = 10
  let interval: string | number | NodeJS.Timer | undefined = undefined

  const isCountdownOn = computed(() => countdownProgress.value > 0 && countdownProgress.value < INITIAL_COUNTDOWN_VALUE)

  const countdownTimer = () => {
    if (gameMode.value === GameModeEnum.quest) {
      countdownFrom.value = piecesCount.value + 1
    }
    const progressDecrement = INTERVAL / (countdownFrom.value * 1000)

    if (countdownProgress.value <= 0) {
      resetProgress()
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
    countdownProgress.value = INITIAL_COUNTDOWN_VALUE
  }

  return {
    startCountdown,
    stopCountdown,
    resetProgress,
    countdownProgress,
    isCountdownOn,
    INITIAL_COUNTDOWN_FROM_VALUE,
  }
}
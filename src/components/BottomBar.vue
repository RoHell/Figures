<script setup lang="ts">
import { IconEnum } from '../types'

import Icon from '../components/Icon.vue'
import BaseButton from '../components/BaseButton.vue'

import {
  useStatus,
  useCoordinates,
  useCountdown,
} from '../composables'
import { computed } from 'vue';

const emit = defineEmits<{
  (e: 'start'): void,
  (e: 'check'): void,
  (e: 'stop'): void,
}>()

const { isPlaying, isStartingGame, isChecking, isCountdownMode } = useStatus()
const { playerFieldCoordinates } = useCoordinates()
const { countdownProgress } = useCountdown()

const handeleStart = () => {
  isStartingGame.value = true
  setTimeout(() => {
    emit('start')
    if (isPlaying.value) {
      isStartingGame.value = false
    }
  }, 0)
}

const showStopButton = computed(() => isChecking.value || (isPlaying.value && !playerFieldCoordinates.value))

const label = computed(() => {
  if (showStopButton.value) {
    return 'stop'
  } else if (isPlaying.value) {
    return 'check'
  }
  return 'start'
})

const style = computed(() => ({
  '--countdown-progress': countdownProgress.value*100 + '%'
}))

const handleClick = () => {
  if (showStopButton.value) {
    emit('stop')
  } else if (isPlaying.value) {
    emit('check')
  } else {
    handeleStart()
  }
}

</script>

<template>
  <div :style="style" class="bottom-bar">
    <BaseButton
      class="bottom-bar__button"
      :disabled="isStartingGame"
      @click="handleClick"
    >
      <span class="button__label" v-text="label" />
      <Icon
        v-if="isCountdownMode"
        class="button__icon"
        :icon="IconEnum.timer"
        :size="24"
      />
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
  .bottom-bar {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;

    &__button {
      margin: auto;
      flex: 1;
      background: linear-gradient(90deg, var(--active-background-color) var(--countdown-progress), transparent var(--countdown-progress));
    }

    .button__label {
      min-width: 4rem;
    }
  }
</style>
<script setup lang="ts">
import { computed } from 'vue';

import { IconEnum } from '../types'

import Icon from '../components/Icon.vue'
import BaseButton from '../components/BaseButton.vue'

import {
  useStatus,
  useCoordinates,
  useCountdown,
} from '../composables'

const emit = defineEmits<{
  (e: 'start'): void,
  (e: 'check'): void,
  (e: 'stop'): void,
  (e: 'continue'): void,
  (e: 'new'): void,
}>()

const { isPlaying, isStartingGame, isChecking, isCountdownMode, showPromptActions } = useStatus()
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
  '--countdown-progress': `${countdownProgress.value * 100}%`
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

const handleContinue = () => {
  emit('continue')
}

const handleNew = () => {
  emit('new')
}

</script>

<template>
  <div :style="style" class="bottom-bar">
    <div v-if="showPromptActions" class="bottom-bar__prompt">
      <BaseButton
        label="continue"
        class="prompt__continue"
        @click="handleContinue"
      />
      <BaseButton
        label="new"
        class="prompt__new"
        @click="handleNew"
      />
    </div>

    <BaseButton
      v-else
      class="bottom-bar__controls"
      :disabled="isStartingGame"
      @click="handleClick"
    >
      <span class="controls__label" v-text="label" />
      <Icon
        v-if="isCountdownMode"
        class="controls__icon"
        :icon="IconEnum.timer"
        :size="24"
      />
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
  .bottom-bar {
    width: 100%;

    &__prompt {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 1rem;
    }

    .prompt__new {
      background-color: var(--active-background-color)
    }

    &__controls {
      margin: auto;
      width: 100%;
      background: linear-gradient(90deg, var(--active-background-color) var(--countdown-progress), transparent var(--countdown-progress));
    }

    .controls__label {
      min-width: 4rem;
    }
  }
</style>
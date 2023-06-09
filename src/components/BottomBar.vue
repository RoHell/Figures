<script setup lang="ts">
import { IconEnum } from '../types'

import Icon from '../components/Icon.vue'
import BaseButton from '../components/BaseButton.vue'

import {
  useStatus,
  useCoordinates,
} from '../composables'
import { computed } from 'vue';

const emit = defineEmits<{
  (e: 'start'): void,
  (e: 'check'): void,
  (e: 'stop'): void,
}>()

const { isPlaying, isStartingGame, isChecking, isCountdownMode } = useStatus()
const { playerFieldCoordinates } = useCoordinates()

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
  <div class="bottom-bar">
    <BaseButton
      class="bottom-bar__center"
      :label="label"
      @click="handleClick"
    >
      <span v-text="label" />
      <Icon
        v-if="isCountdownMode"
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
    gap: 1rem;
    width: 100%;

    &__center {
      margin: auto;
      flex: 1;
    }
  }
</style>
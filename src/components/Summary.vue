<script lang="ts" setup>
import { IconEnum } from '../types'

import Icon from '../components/Icon.vue'
import TopBar from '../components/TopBar.vue'
import BaseButton from '../components/BaseButton.vue'
import Statistics from '../components/Statistics.vue'

const emit = defineEmits<{
  (e: 'close'): void,
}>()
</script>

<template>
  <div class="summary">
    <TopBar title="Summary">
      <template #right>
        <button
          type="button"
          @click="emit('close')"
        >
          <Icon :icon="IconEnum.close" size="2rem"/>
        </button>
      </template>
    </TopBar>
    <h2>Good Job! Quest completed!</h2>
    <Statistics />
    <BaseButton
      class="summary__close"
      label="close"
      type="button"
      @click="emit('close')"
    />
  </div>
</template>

<style lang="scss" scoped>
.summary {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: var(--bg-color);
  padding: 0.5rem;
  z-index: 10;

  &__close {
    margin: auto auto 0;
    width: 100%;
    background-color: var(--button-bg-color);
    color: var(--button-text-color);
    border-color: var(--button-bg-color);
  }
}
</style>
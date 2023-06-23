<script lang="ts" setup>
import { IconEnum } from '../types'

import Icon from '../components/Icon.vue'
import TopBar from '../components/TopBar.vue'
import BaseButton from '../components/BaseButton.vue'

import { useQuest } from '../composables'

const emit = defineEmits<{
  (e: 'close'): void,
}>()

const {
  totalFailsCount,
  killersList,
} = useQuest()
</script>

<template>
  <div class="statistics">
    <TopBar title="Statistics">
      <template #right>
        <button
          type="button"
          @click="emit('close')"
        >
          <Icon :icon="IconEnum.close" size="2rem"/>
        </button>
      </template>
    </TopBar>
    <h2>Good Job!</h2>
    <section class="statistics__content">
      <div v-if="totalFailsCount">
        <h3>TOTAL FAILS</h3>
        {{ totalFailsCount }}
      </div>
      <div v-if="killersList.length">
        <h3>KILLERS</h3>
        {{ killersList }}
      </div>
    </section>
    <BaseButton
      class="statistics__close"
      label="close"
      type="button"
      @click="emit('close')"
    />
  </div>
</template>

<style lang="scss" scoped>
.statistics {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  width: 100%;
  background-color: var(--active-background-color);
  padding: 0.5rem;
  z-index: 10;

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__close {
    margin: auto auto 0;
    width: 100%;
    background-color: var(--button-bg-color);
    color: var(--button-text-color);
    border-color: var(--button-bg-color);
  }

  canvas {
    position: absolute;
    overflow-y: hidden;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    margin: 0;
    top: 0;
    left: 0;
    bottom: 0;
  }
}
</style>
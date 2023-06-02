<script lang="ts" setup>
import { computed } from 'vue';

import { IconEnum } from '../types'

import Icon from '../components/Icon.vue'
import TopBar from '../components/TopBar.vue'

import { useStatus } from '../composables'

const emit = defineEmits<{
  (e: 'close'): void,
}>()

const { isTimingOn, timingValue } = useStatus()

const isTimingModel = computed({
  get: (): boolean => isTimingOn.value,
  set: (value: boolean) => {
    isTimingOn.value = value
  }
})

const timingValueModel = computed({
  get: (): number => timingValue.value,
  set: (value: number) => {
    timingValue.value = value
  }
})

const validateTimingValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  let seconds = Number(target.value)
  if (seconds > 999) {
    timingValue.value = 999
  } else if (seconds < 1) {
    timingValue.value = 1
  }
}
</script>

<template>
  <div class="menu">
    <TopBar title="Menu">
      <template #right>
        <button
          type="button"
          @click="emit('close')"
        >
          <Icon :icon="IconEnum.close" size="2rem"/>
        </button>
      </template>
    </TopBar>

    <div class="menu__content">
      <div class="menu__option">
        <input
          v-model="isTimingModel"
          id="menu-timing"
          type="checkbox"
        >
        <label for="menu-timing" v-text="'Enable Timing (seconds)'" />
        <template v-if="isTimingOn">
          <input
            v-model.number="timingValueModel"
            type="number"
            max="999"
            min="1"
            @change="validateTimingValue"
            class="menu__input-timing-value"
          >
        </template>
      </div>
    </div>

    <button
      class="menu__ok"
      v-text="'ok'"
      @click="emit('close')"
    />
  </div>
</template>

<styl lang="scss" scoped>
  .menu {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    width: 100%;
    background-color: slategray;
    padding: 0.5rem;

    &__content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    &__option {
      display: flex;
      align-items: center;
      min-height: 2rem;
      line-height: 1.2;
    }

    &__input-timing-value {
      margin-left: 2rem;
      height: 2rem;
      width: 2rem;
      text-align: center;
    }

    &__ok {
      text-transform: uppercase;
      background-color: transparent;
      font-size: 1rem;
      padding: 0.75rem;
      width: 5.25rem;
      border-radius: 0.25rem;
      border: 2px solid white;
      outline: none;
      margin: auto auto 0;
      &:disabled {
        border-color: rgba(white, 0.4);
        pointer-events: none;
      }
    }
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }

</styl>
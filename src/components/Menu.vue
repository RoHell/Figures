<script lang="ts" setup>
import { computed } from 'vue';

import { IconEnum, GameModeEnum } from '../types'

import Icon from '../components/Icon.vue'
import TopBar from '../components/TopBar.vue'

import { useStatus } from '../composables'

const emit = defineEmits<{
  (e: 'close'): void,
}>()

const { isTimingOn, timingValue, gameMode } = useStatus()

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

const gameModeModel = computed({
  get: (): GameModeEnum => gameMode.value,
  set: (value: GameModeEnum) => {
    gameMode.value = value
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
      <div class="menu__option menu__option--radios">
        <div class="menu__radio">
          <input
            v-model="gameModeModel"
            type="radio"
            id="menu-school-mode"
            name="menu-game-mode"
            :value="GameModeEnum.school"
          >
          <label for="menu-school-mode" v-text="GameModeEnum.school" />
        </div>
        <div class="menu__radio">
          <input
            v-model="gameModeModel"
            type="radio"
            id="menu-quest-mode"
            name="menu-game-mode"
            :value="GameModeEnum.quest"
          >
          <label for="menu-quest-mode" v-text="GameModeEnum.quest" />
        </div>
      </div>

      <div class="menu__option menu__option--checkbox">
        <div>
          <input
            v-model="isTimingModel"
            id="menu-timing"
            type="checkbox"
          >
          <label for="menu-timing" v-text="'Enable Timing (seconds)'" />
        </div>

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

      &--radios {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      &--checkbox {
        gap: 2rem;
      }
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
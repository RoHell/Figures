<script lang="ts" setup>
import { computed } from 'vue';

import { IconEnum, GameModeEnum } from '../types'

import Icon from '../components/Icon.vue'
import TopBar from '../components/TopBar.vue'

import { useStatus } from '../composables'

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'game-mode', mode: GameModeEnum): void,
}>()

const { isCountdownMode, countdownFrom, gameMode } = useStatus()

const isCountdownModel = computed({
  get: (): boolean => isCountdownMode.value,
  set: (value: boolean) => {
    isCountdownMode.value = value
  }
})

const countdownFromModel = computed({
  get: (): number => countdownFrom.value,
  set: (value: number) => {
    countdownFrom.value = value
  }
})

const gameModeModel = computed({
  get: (): GameModeEnum => gameMode.value,
  set: (value: GameModeEnum) => {
    emit('game-mode', value)
  }
})

const validateTimingValue = (event: Event) => {
  const target = event.target as HTMLInputElement

  const seconds = Number(target.value)

  if (seconds > 999) {
    countdownFrom.value = 999
  } else if (seconds < 1) {
    countdownFrom.value = 1
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
        <div class="menu__checkbox">
          <input
            v-model="isCountdownModel"
            id="menu-timing"
            type="checkbox"
          >
          <label for="menu-timing" v-text="'Countdown (seconds)'" />
        </div>

        <template v-if="isCountdownMode && (gameMode === GameModeEnum.school)">
          <input
            v-model.number="countdownFromModel"
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
      class="menu__ok button-base"
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
    background-color: var(--active-background-color);
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
        justify-content: center;
        gap: 0.5rem;
      }

      &--checkbox {
        gap: 1rem;
        align-items: center;
        text-align: start;
      }
    }

    &__radio,
    &__checkbox {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 0.25rem;

      label {
        width: 100%;
        text-align: start;
      }
    }

    &__input-timing-value {
      margin-left: 2rem;
      height: 2rem;
      width: 2rem;
      text-align: center;
    }

    &__ok {
      margin: auto auto 0;
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
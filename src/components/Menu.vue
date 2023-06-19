<script lang="ts" setup>
import { reactive } from 'vue';

import { IconEnum, GameModeEnum } from '../types'

import Icon from '../components/Icon.vue'
import TopBar from '../components/TopBar.vue'
import BaseButton from '../components/BaseButton.vue'

import { useStatus, useQuest, useStorage } from '../composables'

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'game-mode', mode: GameModeEnum): void,
  (e: 'countdown', mode: boolean): void,
}>()

const {
  isCountdownMode,
  gameMode,
} = useStatus()

const { isQuestMode } = useQuest()

const model = reactive({
  countdown: isCountdownMode.value,
  gameMode: gameMode.value
})

const handleSubmit = () => {
  if (model.countdown !== isCountdownMode.value) {
    emit('countdown', model.countdown)
  }
  if (model.gameMode !== gameMode.value) {
    emit('game-mode', model.gameMode)
  }
  emit('close')
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="menu">
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
            v-model="model.gameMode"
            type="radio"
            id="menu-school-mode"
            name="menu-game-mode"
            :value="GameModeEnum.school"
          >
          <label for="menu-school-mode" v-text="GameModeEnum.school" />
        </div>
        <div class="menu__radio">
          <input
            v-model="model.gameMode"
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
            v-model="model.countdown"
            id="menu-timing"
            type="checkbox"
          >
          <label for="menu-timing" v-text="'Play with Countdown mode'" />
        </div>
        <span v-if="isQuestMode && (model.countdown !== isCountdownMode)"><em>(toggling countdown mode will reset your current game. Are you sure?)</em></span>
      </div>
    </div>

    <BaseButton
      class="menu__ok"
      label="ok"
      type="submit"
    />
  </form>
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
        flex-direction: column;
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

    &__ok {
      margin: auto auto 0;
      width: 100%;
    }
  }

</styl>
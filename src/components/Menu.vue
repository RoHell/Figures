<script lang="ts" setup>
import { computed, reactive } from 'vue'

import { IconEnum, GameModeEnum } from '../types'

import Icon from '../components/Icon.vue'
import TopBar from '../components/TopBar.vue'
import BaseButton from '../components/BaseButton.vue'
import Statistics from '../components/Statistics.vue'

import { useStatus, useQuest } from '../composables'

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'game-mode', mode: GameModeEnum): void,
  (e: 'countdown', mode: boolean): void,
}>()

const {
  isCountdownMode,
  gameMode,
  showSummary,
} = useStatus()

const {
  totalFailsCount,
  killersList,
  killersMap,
  unsetDecisionsCount,
  isQuestMode,
  isStageInProgress,
} = useQuest()

const model = reactive({
  countdown: isCountdownMode.value,
  gameMode: gameMode.value
})

const isOptionChanged = computed(() => {
  return (isCountdownMode.value !== model.countdown) || (gameMode.value !== model.gameMode)
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
      <section class="content-section">
        <h2 class="content-section__title" v-text="'Options'" />
        <div class="content-section__wrapper">
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
          </div>
        </div>

        <BaseButton
          class="menu__ok"
          label="Confirm and play"
          type="submit"
          :disabled="!isOptionChanged"
        />
      </section>

      <section v-if="model.gameMode === GameModeEnum.quest" class="content-section">
        <h2 class="content-section__title" v-text="'Statistics'" />
        <div class="content-section__wrapper" >
          <Statistics v-if="isStageInProgress" />
          <div v-else>
            Start quest to show statistics.
          </div>
        </div>
      </section>
    </div>
  </form>
</template>

<style lang="scss" scoped>
  .menu {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    width: 100%;
    background-color: var(--bg-color);
    padding: 0.5rem;
    z-index: 10;

    &__content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      overflow: auto;
      height: 100%;
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
      margin-top: 1rem;
      width: 100%;
      background-color: var(--active-background-color);
    }
  }

  .content-section {
    display: flex;
    flex-direction: column;
    text-align: start;

    &__wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      overflow: auto;
    }

    &__title {
      font-weight: 900;
      margin-bottom: 0.5rem;
      letter-spacing: 0.125rem;
      text-transform: uppercase;
    }
  }


@media screen and (orientation: landscape) {
  .menu__content {
    flex-direction: row;
    .content-section {
      flex: 1;
    }
  }
}
</style>
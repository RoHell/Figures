<script lang="ts" setup>
import { reactive } from 'vue'

import { IconEnum, GameModeEnum } from '../types'

import Icon from '../components/Icon.vue'
import TopBar from '../components/TopBar.vue'
import BaseButton from '../components/BaseButton.vue'

import { useStatus, useQuest } from '../composables'

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'game-mode', mode: GameModeEnum): void,
  (e: 'countdown', mode: boolean): void,
}>()

const {
  isCountdownMode,
  gameMode,
  showStatistics,
} = useStatus()

const {
  totalFailsCount,
  killersList,
  killersMap,
  unsetDecision,
} = useQuest()

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
      </section>

      <section class="content-section">
        <h2 class="content-section__title" v-text="'Statistics'" />
        <div class="content-section__wrapper" >
          <template v-if="totalFailsCount || killersList.length">

            <div class="section-element">
              <div class="section-element__title">Total fails: </div>
              <div class="section-element__content">
                <b>{{ totalFailsCount }}</b>
              </div>
            </div>

            <div class="section-element">
              <div class="section-element__title">Wrong decisions: </div>
              <div class="section-element__content">
                <b>{{ totalFailsCount - unsetDecision }}</b>
              </div>
            </div>

            <div class="section-element">
              <div class="section-element__title">No decisions: </div>
              <div class="section-element__content">
                <b>{{ unsetDecision }}</b>
              </div>
            </div>
            
            <div v-if="killersList.length" class="section-element">
              <div class="section-element__title">Killers: </div>
              <div class="section-element__content">
                <div
                  v-for="(value, key) in killersMap"
                  class="section-element__killer"
                >
                  <Icon :icon="IconEnum[key]" :size="30"/>
                  <span> x <b>{{ value }}</b></span>
                </div>
              </div>
            </div>

          </template>
          <div v-else>
            You have nothing to show. Start to play.
          </div>
        </div>
      </section>
    </div>

    <BaseButton
      class="menu__ok"
      label="ok"
      type="submit"
    />
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
      gap: 1rem;
      overflow: auto;
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
      background-color: var(--active-background-color);
    }
  }

  .content-section {
    display: flex;
    flex-direction: column;
    text-align: start;
    flex: 1;

    &__wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      overflow: auto;
    }

    &__title {
      font-weight: 900;
      margin-bottom: 0.5rem;
      text-decoration: underline;
      letter-spacing: 0.25rem;
      text-transform: uppercase;
    }
  }

  .section-element {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &__title {
      text-transform: uppercase;
    }

    &__content {
      font-size: large;
      display: flex;
      gap: 1rem;
    }

    &__killer {
      display: flex;
      align-items: center;
    }
  }


@media screen and (orientation: landscape) {
  .menu__content {
    flex-direction: row;
  }
}
</style>
<script setup lang="ts">
import { computed, ref } from 'vue';

import { LevelEnum, GridSizeEnum, IconEnum } from '../types'

import Icon from '../components/Icon.vue'

interface Props {
  startDisabled?: boolean
  activeLevel?: LevelEnum
  activeGridCols?: number
}

const props = withDefaults(defineProps<Props>(), {
  startDisabled: false,
  activeLevel: LevelEnum.easy,
  activeGridCols: GridSizeEnum.four,
})

const emit = defineEmits<{
  (e: 'level', value: LevelEnum): void
  (e: 'grid', value: number): void
}>()

const isOpen = ref(false)

const levels = [
  {
    emoji: '&#128512;',
    name: 'easy',
    hardness: LevelEnum.easy,
  },
  {
    emoji: '&#128524;',
    name: 'medium',
    hardness: LevelEnum.medium,
  },
  {
    emoji: '&#128528;',
    name: 'hard',
    hardness: LevelEnum.hard,
  },
  {
    emoji: '&#128552;',
    name: 'extreme',
    hardness: LevelEnum.extreme,
  },
  {
    emoji: '&#128561;',
    name: 'insane',
    hardness: LevelEnum.insane,
  },
]

const grids = [
  {
    name: 'four',
    count: GridSizeEnum.four,
    emoji: '&#10125;',
  },
  {
    name: 'six',
    count: GridSizeEnum.six,
    emoji: '&#10127;',
  },
  {
    name: 'eight',
    count: GridSizeEnum.eight,
    emoji: '&#10129;',
  },
]

const menuIcon = computed(() => isOpen.value ? IconEnum.close : IconEnum.more)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const selectedLevel = computed(() => levels.find(l => l.hardness === props.activeLevel))

const selectedGrid = computed(() => grids.find(g => g.count === props.activeGridCols))
</script>

<template>
  <div class="menu">
    <div class="menu__header">
      <span class="menu__header-title">Avoid Figures</span>
      <button class="menu__header-toggle" @click="toggleMenu">
        <Icon :icon="menuIcon" size="3.25rem"/>
      </button>
    </div>
    <div
      v-if="isOpen"
      class="menu__opened"
    >
      <span>
        Tu będą ustawienia
      </span>
      <Icon :icon="IconEnum.settings" size="5rem"/>
    </div>

    <div
      v-else
      class="menu__closed"
    >
      <div class="menu__grids">
        <span v-text="'GRID: '" />
        <button
          v-for="grid in grids"
          type="button"
          :title="grid.name"
          class="menu__grid"
          :class="{
            ' menu__grid--active': activeGridCols === grid.count,
          }"
          @click="emit('grid', grid.count)"
          v-html="grid.emoji"
        />
      </div>
      <div class="menu__levels">
        <span v-text="'LEVEL: '"/>
        <button
          v-for="level in levels"
          type="button"
          :title="level.name"
          class="menu__level"
          :class="{
            ' menu__level--active': activeLevel === level.hardness,
          }"
          @click="emit('level', level.hardness)"
          v-html="level.emoji"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  position:relative;
  aspect-ratio: 1;
  max-height: 340px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  background-color: rgba(dimgray, 0.9);

  &__opened,
  &__closed {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
    margin: auto;
    width: 100%;
  }

  &__opened {
    align-items: center;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    padding: 1rem;
    border-bottom: 2px solid;
    background-color: dimgray;

    &-title {
      font-size: xx-large;
      flex: 1;
      font-weight: 500;
      margin: auto;
    }

    &-toggle {
      display: flex;
      margin-left: auto;
      background: none;
      outline: none;
      border: none;
      padding: 0;
      opacity: 0.8;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }
  }

  &__levels,
  &__grids {
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }

  &__level,
  &__grid {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    line-height: 0;
    background: none;
    border: 2px solid transparent;
    border-radius: 50%;
    outline: none;
    aspect-ratio: 1;

    &--active {
      border: 2px solid white;
    }
  }

  &__grid {
    font-size: 3rem;
  }

  &__level {
    font-size: 1.5rem;
  }

  &__start {
    text-transform: uppercase;
    border-radius: 0.25rem;
    border: 2px solid white;
    background-color: transparent;
    font-size: 1.25rem;
    padding: 1rem;
  }
}
</style>

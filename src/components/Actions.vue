<script setup lang="ts">
import { LevelEnum, GridColsEnum } from '../types'

interface Props {
  startDisabled?: boolean
  activeLevel?: LevelEnum
  activeGridCols?: number
}

withDefaults(defineProps<Props>(), {
  startDisabled: false,
  activeLevel: LevelEnum.easy,
  activeGridCols: GridColsEnum.four,
})

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'stop'): void
  (e: 'level', value: LevelEnum): void
  (e: 'grid', value: number): void
}>()

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
    count: GridColsEnum.four,
    emoji: '&#10125;',
  },
  {
    name: 'six',
    count: GridColsEnum.six,
    emoji: '&#10127;',
  },
  {
    name: 'eight',
    count: GridColsEnum.eight,
    emoji: '&#10129;',
  },
]
</script>

<template>
  <div class="actions">
    <div class="actions__grids">
      <button
        v-for="grid in grids"
        type="button"
        :title="grid.name"
        class="actions__grid"
        :class="{
          ' actions__grid--active': activeGridCols === grid.count,
        }"
        @click="emit('grid', grid.count)"
        v-html="grid.emoji"
      />
    </div>
    <div class="actions__levels">
      <button
        v-for="level in levels"
        type="button"
        :title="level.name"
        class="actions__level"
        :class="{
          ' actions__level--active': activeLevel === level.hardness,
        }"
        @click="emit('level', level.hardness)"
        v-html="level.emoji"
      />
    </div>

    <button
      type="button"
      class="actions__start"
      :disabled="startDisabled"
      @click="emit('start')"
      v-text="'start'"
    />
  </div>
</template>

<style lang="scss" scoped>
.actions {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: auto;

  &__levels,
  &__grids {
    display: flex;
    gap: 0.25rem;
    justify-content: space-around;
    align-items: center;
  }

  &__level,
  &__grid {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
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
    font-size: 4rem;
  }

  &__level {
    font-size: 2rem;
  }

  &__start {
    text-transform: uppercase;
    border-radius: 0.25rem;
    border: 1px solid white;
    background-color: transparent;
    font-size: 1.25rem;
    padding: 1rem;
  }
}
</style>

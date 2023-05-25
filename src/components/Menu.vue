<script setup lang="ts">
import { reactive, ref } from 'vue';

import {
  LevelEnum,
  GridSizeEnum,
  ConfigNameEnum,
  type ConfigInterface,
} from '../types'

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

const configModel = reactive<Record<ConfigNameEnum, boolean>>({
  pieces: false,
  vibrations: false,
  sounds: false,
  tips: true
})

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
    name: '4 x 4',
    count: GridSizeEnum.four,
    emoji: '&#10125;',
  },
  {
    name: '6 x 6',
    count: GridSizeEnum.six,
    emoji: '&#10127;',
  },
  {
    name: '8 x 8',
    count: GridSizeEnum.eight,
    emoji: '&#10129;',
  },
]

const configs: ConfigInterface[] = [
  {
    id: '1',
    name: ConfigNameEnum.pieces,
    label: 'peces blocks each other',
  },
  {
    id: '2',
    name: ConfigNameEnum.vibrations,
    label: 'vibrations',
  },
  {
    id: '3',
    name: ConfigNameEnum.sounds,
    label: 'sounds',
  },
  {
    id: '4',
    name: ConfigNameEnum.sounds,
    label: 'tips',
  }
]
</script>

<template>
  <div class="menu">
    <div
      v-if="isOpen"
      class="menu__opened"
    >
      <div
        v-for="{ id, name, label } in configs"
        class="menu__config"
      >
        <input
          :id="id"
          v-model="configModel[name]"
          type="checkbox"
          :checked="configModel[name]"
          :name="name"
        />
        <label
          :for="id"
          v-text="label"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  position:relative;
  aspect-ratio: 1;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
    text-align: start;
  }

  // &__header {
  //   display: flex;
  //   align-items: center;
  //   gap: 1rem;
  //   width: 100%;
  //   padding: 1rem;
  //   border-bottom: 2px solid;
  //   background-color: dimgray;

  //   &-title {
  //     font-size: xx-large;
  //     text-transform: uppercase;
  //     flex: 1;
  //     font-weight: 500;
  //     margin: auto;
  //     text-align: center;
  //   }

  //   &-toggle {
  //     display: flex;
  //     margin-left: auto;
  //     background: none;
  //     outline: none;
  //     border: none;
  //     padding: 0;
  //     opacity: 0.8;
  //     transition: opacity 0.2s;

  //     &:hover {
  //       opacity: 1;
  //     }
  //   }
  // }

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

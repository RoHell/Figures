<script setup lang="ts">
import { useStatus } from '../composables'

import { IconEnum } from '../types'

import Icon from '../components/Icon.vue'

interface Props {
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
})

const emit = defineEmits<{
  (e: 'back'): void,
}>()

const {
  isCountdownMode,
  gameMode,
} = useStatus()

</script>

<template>
  <div class="top-bar">
    <div
      v-if="$slots.left"
      class="top-bar__left"
    >
      <slot name="left" />
    </div>
    <slot name="title">
      <p
        class="top-bar__title"
        @click="emit('back')"
      >
        <span
          v-if="title"
          v-text="title"
        />
        <span v-else class="logo">
          <span class="logo__game">Game</span>
          <em class="logo__bit">
            <b>bit</b>
            <span class="logo__bit-mode" v-text="gameMode"/>
            <Icon
              v-if="isCountdownMode"
              :icon="IconEnum.timer"
              size="1rem"
              class="logo__bit-timer"
            />
          </em>
        </span>
      </p>
    </slot>
    <div
      v-if="$slots.right"
      class="top-bar__right"
    >
      <slot name="right" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .top-bar {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;

    &__title {
      font-size: xx-large;
      text-transform: uppercase;
      flex: 1;
      font-weight: 500;
      margin: auto;
      text-align: center;
    }

    &__left,
    &__right {
      position: absolute;
      opacity: 0.7;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }

    &__left {
      left: 0;
      
    }

    &__right {
      right: 0;
    }
  }

.logo__bit {
  position: relative;

  &-mode {
    position: absolute;
    bottom: 0;
    left: 30%;
    font-size: x-small;
    color: white;
    font-weight: 900;
    text-shadow:
    -1px -1px 0 #000,
     0   -1px 0 #000,
     1px -1px 0 #000,
     1px  0   0 #000,
     1px  1px 0 #000,
     0    1px 0 #000,
    -1px  1px 0 #000,
    -1px  0   0 #000;
  }

  &-timer {
    position: absolute;
    color: white;
    margin: 0.25rem;
    top: 0;
  }
}
</style>
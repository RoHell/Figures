<script setup lang="ts">
import { useStatus } from '../composables'

interface Props {
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: '',
})

const emit = defineEmits<{
  (e: 'back'): void,
}>()

const {
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
      <p class="top-bar__title" @click="emit('back')">
        <span v-if="title" v-text="title" />
        <span v-else class="logo">
          Game
          <em class="logo__bit">
            bit
            <span class="logo__bit-mode" v-text="gameMode" />
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
      color: inherit;
    }

    &__left {
      left: 0;
    }

    &__right {
      right: 0;
    }
  }

  .logo {
    font-weight: 900;

    &__bit {
      position: relative;
      text-shadow: -3px 0 0 var(--text-shadow-color);
      left: -10px;

      &-mode {
        position: absolute;
        bottom: 0;
        left: 30%;
        font-size: x-small;
        text-shadow:
        -1px -1px 0 var(--text-shadow-color),
        0   -1px 0 var(--text-shadow-color),
        1px -1px 0 var(--text-shadow-color),
        1px  0   0 var(--text-shadow-color),
        1px  1px 0 var(--text-shadow-color),
        0    1px 0 var(--text-shadow-color),
        -1px  1px 0 var(--text-shadow-color),
        -1px  0   0 var(--text-shadow-color);
      }
    }
  }
</style>
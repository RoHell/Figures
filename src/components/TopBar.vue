<script setup lang="ts">
import { computed } from 'vue'

import { IconEnum } from '../types'

import { useStatus } from '../composables'

import Icon from '../components/Icon.vue'

const emit = defineEmits<{
  (e: 'back'): void,
  (e: 'menu'): void,
}>()

const { isMenuOpen } = useStatus()

const menuIcon = computed(() => isMenuOpen.value ? IconEnum.close : IconEnum.more)

</script>

<template>
  <div class="top-bar">
    <button
      class="top-bar__back"
      :class="{
        'top-bar__back--hidden': true
      }"
      @click="emit('back')"
    >
      <Icon :icon="IconEnum.back" size="3rem"/>
    </button>

    <p
      class="top-bar__title"
      @click="emit('back')"
    >
      Game<em><b>bit</b></em>
    </p>

    <button
      class="top-bar__menu"
      :class="{
        'top-bar__menu--hidden': true
      }"
      @click="emit('menu')"
    >
      <Icon :icon="menuIcon" size="3rem"/>
    </button>
  </div>
</template>

<style lang="scss" scoped>
  .top-bar {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    height: var(--top-bar-height);
    padding: 1rem;
    border-bottom: 1px solid;
    background-color: dimgray;

    &__title {
      font-size: xx-large;
      text-transform: uppercase;
      flex: 1;
      font-weight: 500;
      margin: auto;
      text-align: center;
    }

    &__menu,
    &__back {
      display: flex;
      margin-left: auto;
      background: none;
      outline: none;
      border: none;
      padding: 0;
      opacity: 0.8;
      transition: opacity 0.2s;

      &:hover:not(.top-bar__back--hidden) {
        opacity: 1;
      }

      &--hidden {
        opacity: 0;
        user-select: none;
        pointer-events: none;
      }
    }
  }
</style>
<script setup lang="ts">
import { computed } from 'vue'

import { IconEnum } from '../types'

import { useStatus } from '../composables'

import Icon from '../components/Icon.vue'

const emit = defineEmits<{
  (e: 'back'): void,
  (e: 'menu'): void,
}>()

const { isMenuOpen, isPlaying } = useStatus()

const menuIcon = computed(() => isMenuOpen.value ? IconEnum.close : IconEnum.more)

</script>

<template>
  <header class="header">
    <button
      class="header__back"
      :class="{
        'header__back--hidden': !isPlaying
      }"
      @click="emit('back')"
    >
      <Icon :icon="IconEnum.back" size="3rem"/>
    </button>
    <p class="header__title">Game<em><b>bit</b></em></p>
    <button class="header__menu" @click="emit('menu')">
      <Icon :icon="menuIcon" size="3rem"/>
    </button>
  </header>
</template>

<style lang="scss" scoped>
  .header {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    height: var(--header-height);
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

      &:hover:not(.header__back--hidden) {
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
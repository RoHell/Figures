<script setup lang="ts">
import Icon from '../components/Icon.vue'
import { IconEnum } from '../types/icons'

const figures: IconEnum[] = [
  IconEnum.bishop,
  IconEnum.rook,
  IconEnum.queen,
  IconEnum.knight,
]
</script>

<template>
  <div class="figures">
    <Icon :icon="IconEnum.pawn" class="figures__player" />
    <div class="figures__cpu">
      <Icon
        v-for="figure in figures"
        :icon="figure"
        :class="`figures__${figure}`"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.figures {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  display: none;

  &__cpu {
    display: flex;
    height: 4rem;
  }

  &__player {
    color: #00FF00;
  }
}
</style>
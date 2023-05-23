<script setup lang="ts">
import Icon from '../components/Icon.vue'
import { IconEnum } from '../types'

const figures: IconEnum[] = [
  IconEnum.bishop,
  IconEnum.rook,
  IconEnum.queen,
  IconEnum.knight,
]

const playerFigure = IconEnum.pawn
</script>

<template>
  <div class="figures">
    <Icon
      :icon="playerFigure"
      color="#00FF00"
      :data-figure="playerFigure"
    />
    <div class="figures__cpu">
      <Icon
        v-for="figure in figures"
        :icon="figure"
        :data-figure="figure"
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
}
</style>
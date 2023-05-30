<script setup lang="ts">
import Icon from '../components/Icon.vue'
import { IconEnum } from '../types'

const pieces: IconEnum[] = [
  IconEnum.bishop,
  IconEnum.rook,
  IconEnum.queen,
  IconEnum.knight,
]

const playerPiece = IconEnum.pawn
</script>

<template>
  <div class="pieces">
    <Icon
      :icon="playerPiece"
      color="#00FF00"
      :data-piece="playerPiece"
    />
    <div class="pieces__cpu">
      <Icon
        v-for="piece in pieces"
        :icon="piece"
        :data-piece="piece"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.pieces {
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
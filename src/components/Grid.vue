<script setup lang="ts">
import { computed } from 'vue'

import { type CoordinatesInterface } from '../types'

import { useStatus, useGrid } from '../composables'

const { isPlaying, isChecking, isStartingGame } = useStatus()

const { gridSize } = useGrid()

const emit = defineEmits<{
  (e: 'field', value: CoordinatesInterface): void
  (e: 'down', value: CoordinatesInterface): void
  (e: 'up'): void
}>()

const fieldsCount = computed(() => gridSize.value * gridSize.value)

const colsRangeArray = computed((): number[] =>
  Array.from({ length: gridSize.value }, (_, idx) => idx + 1)
)

const getRowIndex = (index: number) => {
  return colsRangeArray.value.reduce((acc: number, r: number) => {
    if (index + 1 > r * gridSize.value) {
      acc = r
    }
    return acc
  }, 0)
}

const getColumnIndex = (index: number) => index % gridSize.value

const handleFieldSelect = (index: number) => {
  emit('field', getFieldCoordinates(index))
}

const getFieldCoordinates = (index: number) => ({
  x: getColumnIndex(index),
  y: getRowIndex(index),
})

const style = computed(() => ({
  '--cols': gridSize.value,
}))

const handleMouseDown = (index: number) => {
  emit('down', getFieldCoordinates(index))
}

const handleMouseUp = () => {
  emit('up')
}
</script>

<template>
  <div
    class="grid"
    :class="{
      'grid--disabled': isChecking || isStartingGame || !isPlaying,
    }"
    :style="style"
  >
    <div
      v-for="(_, index) in fieldsCount"
      class="grid__field-wrapper"
    >
      <div
        class="grid__field"
        :data-x="getColumnIndex(index)"
        :data-y="getRowIndex(index)"
        @click="handleFieldSelect(index)"
        @mousedown="handleMouseDown(index)"
        @mouseup="handleMouseUp()"
        @touchstart="handleMouseDown(index)"
        @touchend="handleMouseUp()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(1rem, 1fr));
  grid-template-rows: repeat(var(--cols), minmax(1rem, 1fr));

  &__field-wrapper {
    border: 1px solid;
    margin: -0.5px;
    cursor: pointer;

    &:has(.grid__field--marked) {
      background-color: red;
      pointer-events: none;
    }
    
    &:has(.grid__field--player) {
      background-color: lightslategray;
      pointer-events: none;
    }
  }

  &__field {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    transition: all 1s ease-in-out 1s;
    padding: 5%;

    &--killer, &--killed {
      pointer-events: none;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
      perspective: 1000px;
    }

    &--killer {
      animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
    }

    &--killed {
      animation: play-dead 5s cubic-bezier(.4,.1,.2,.97) both;
      animation-delay: 0.25s;
    }
  }

  &--disabled {
    pointer-events: none;
  }
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

@keyframes play-dead {
  1% {
    transform: rotateZ(-15deg);
  }
  2% {
    transform: translate3d(-10%, 0, 0) rotateZ(-15deg);
  }
  3% {
    transform: translate3d(-15%, 0, 0) rotateZ(-12deg);
  }

  10% {
    transform: translate3d(0, 0, 0)  rotateZ(90deg);
  }

  12% {
    transform: translate3d(0, 25%, 0) rotateZ(90deg);
    opacity: 1;
  }

  30% {
    transform: translate3d(0, 25%, 0) rotateZ(90deg);
    opacity: 0.8;
  }

  100% {
    transform: translate3d(0, -400px, 0) rotateZ(0);
    opacity: 0;
  }
}
</style>

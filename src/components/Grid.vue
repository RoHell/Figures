<script setup lang="ts">
import { computed } from 'vue'

import { type CoordinatesInterface } from '../types'

import { useStatus, useGrid } from '../composables'

const { isPlaying, isChecking } = useStatus()

const { gridSize } = useGrid()

interface Props {
  cols?: number
}

const props = withDefaults(defineProps<Props>(), {
  cols: 4,
})

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
      'grid--is-checking': isChecking,
      'grid--is-not-playing': !isPlaying,
    }"
    :style="style"
  >
    <div
      v-for="(_, index) in fieldsCount"
      class="grid__field"
      :data-x="getColumnIndex(index)"
      :data-y="getRowIndex(index)"
      data-marked
      data-figure_field
      @click="handleFieldSelect(index)"
      @mousedown="handleMouseDown(index)"
      @mouseup="handleMouseUp()"
      @touchstart="handleMouseDown(index)"
      @touchend="handleMouseUp()"
    />
  </div>
</template>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(1rem, 1fr));
  grid-template-rows: repeat(var(--cols), minmax(1rem, 1fr));

  &__field {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid white;
    padding: 0.5rem;
    aspect-ratio: 1;
    flex-grow: 0;
    cursor: pointer;

    &--marked {
      background-color: red;
      pointer-events: none;
    }
  }

  &--is-checking,
  &--is-not-playing {
    pointer-events: none;
  }

  &--is-not-playing {
    // opacity: 0.2;
  }
}
</style>

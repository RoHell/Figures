<script setup lang="ts">
import { ref, toRef } from 'vue';

import { type CoordinatesInterface } from '../types'

interface Props {
  disabled: boolean,
  gameOver: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  gameOver: false,
})

const emit = defineEmits<{
  (e: 'field-select', value: CoordinatesInterface): void
}>()

const selectedGridField = ref<CoordinatesInterface>()
const isGameOver = toRef(props, 'gameOver')

const getRowNumber = (fieldNumber: number) => {
  if (fieldNumber <= 4) {
    return 0
  } else if (fieldNumber <=8) {
    return 1 
  } else if (fieldNumber <=12) {
    return 2
  }
  return 3
}

const handleFieldSelect = (fieldNumber: number) => {
  emit('field-select', getFieldCoordinates(fieldNumber))
}

const getFieldCoordinates = (fieldNumber: number) => ({
  x: (fieldNumber - 1 )%4,
  y: getRowNumber(fieldNumber),
})

const isSelectedField = (fieldNumber: number) => {
  const isSelectedColumn = selectedGridField.value?.x === getFieldCoordinates(fieldNumber)?.x
  const isSelectedRow = selectedGridField.value?.y === getFieldCoordinates(fieldNumber)?.y
  return isSelectedColumn && isSelectedRow
}
</script>

<template>
  <div
    class="grid"
    :class="{
      'grid--disabled': disabled
    }"
  >
    <div
      v-for="field in 16"
      class="grid__field"
      :class="`grid__field__${getFieldCoordinates(field).x}-${getFieldCoordinates(field).y}`"
      @click="handleFieldSelect(field)"
    />
  </div>
</template>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(1rem, 1fr));
  grid-template-rows: repeat(4, minmax(1rem, 1fr));
  border: 1px solid gray;

  &__field {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid gray;
    padding: 0.5rem;
    aspect-ratio: 1;
    flex-grow: 0;
    cursor: pointer;

    &--figure {
      pointer-events: none;
    }

    &--marked {
      background-color: red;
      pointer-events: none;
    }
  }

  &--disabled {
    pointer-events: none;
  }
}
</style>
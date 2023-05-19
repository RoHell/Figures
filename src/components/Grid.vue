<script setup lang="ts">
import { computed } from 'vue';
import { type CoordinatesInterface } from '../types'

interface Props {
  disabled: boolean,
  cols: number
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  cols: 4,
})

const emit = defineEmits<{
  (e: 'field-select', value: CoordinatesInterface): void
}>()

const fieldsCount = computed(() => props.cols*props.cols)

const colsRangeArray = computed((): number[] => Array.from({ length: props.cols }, (_, idx) => idx + 1))

const getRowIndex = (index: number) => {
  return colsRangeArray.value.reduce((acc: number, r: number) => {
    if ((index + 1) > r*props.cols) {
      acc = r
    }
    return acc
  }, 0)
}

const getColumnIndex = (index: number) => {
  return index%props.cols
}

const handleFieldSelect = (index: number) => {
  console.log('getFieldCoordinates(index)', getFieldCoordinates(index))
  emit('field-select', getFieldCoordinates(index))
}

const getFieldCoordinates = (index: number) => ({
  x: getColumnIndex(index),
  y: getRowIndex(index),
})

const style = computed(() => ({
  '--cols': props.cols,
}))
</script>

<template>
  <div
    class="grid"
    :class="{
      'grid--disabled': disabled
    }"
    :style="style"
  >
    <div
      v-for="(field, index) in fieldsCount"
      class="grid__field"
      :class="`grid__field__${getFieldCoordinates(index).x}-${getFieldCoordinates(index).y}`"
      @click="handleFieldSelect(index)"
    />
  </div>
</template>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(1rem, 1fr));
  grid-template-rows: repeat(var(--cols), minmax(1rem, 1fr));
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

    &--marked:not(.grid__field--figure) {
      background-color: red;
      pointer-events: none;
    }
  }

  &--disabled {
    pointer-events: none;
  }
}
</style>
<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  progress?: number
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0.5,
})

const style = computed(() => ({
  '--progress-width': `${props.progress * 100}%`
}))
</script>

<template>
  <div :style="style" class="progress-bar">
    <div class="progress-bar__progress" />
  </div>
</template>

<style lang="scss" scoped>
.progress-bar {
  width: 100%;
  height: 0.5rem;
  width: 100%;
  border-radius: 0.25rem;
  background-color: rgba(slategray, 0.2);

  &__progress {
    width: var(--progress-width);
    height: 100%;
    border-radius: 0.25rem;
    background-color: lightgray;
  }
}
</style>
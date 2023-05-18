<script setup lang="ts">
import { LevelEnum } from '../types'

interface Props {
  startDisabled: boolean
}

withDefaults(defineProps<Props>(), {
  startDisabled: false
})

const emit = defineEmits<{
  (e: 'start'): void,
  (e: 'stop'): void,
  (e: 'level', value: LevelEnum): void,
}>()
</script>

<template>
  <div class="actions">
    <button
      type="button"
      class="actions__start"
      :disabled="startDisabled"
      @click="emit('start')"
      v-text="'start'"
    />
    <div class="actions__level">
      <button
        type="button"
        class="actions__level-easy"
        @click="emit('level', LevelEnum.easy)"
        v-text="'easy'"
      />
      <button
        type="button"
        class="actions__level-hard"
        @click="emit('level', LevelEnum.hard)"
        v-text="'hard'"
      />
      <button
        type="button"
        class="actions__level-insane"
        @click="emit('level', LevelEnum.insane)"
        v-text="'insane'"
      />
    </div>
    <!-- <button
      type="button"
      class="actions__stop"
      @click="emit('stop')"
      v-text="'stop'"
    /> -->
  </div>
</template>

<style lang="scss" scoped>
.actions {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: auto;

  button {
    border-radius: 0.25rem;
    text-transform: uppercase;
  }

  &__level {
    display: flex;
    gap: 1rem;

    &-easy {
      background-color: yellow;
      color: black
    }

    &-hard {
      background-color: blue;
    }

    &-insane {
      background-color: red;
    }
  }

  &__start {
    background-color: green;
    font-size: 2rem;
  }

  &__stop {
    background-color: blue;
  }
}
</style>
<script setup lang="ts">
import { ref } from 'vue'

import { LevelEnum } from '../types'

interface Props {
  startDisabled?: boolean
  activeLevel?: LevelEnum
}

withDefaults(defineProps<Props>(), {
  startDisabled: false,
  activeLevel: LevelEnum.easy,
})

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'stop'): void
  (e: 'level', value: LevelEnum): void
}>()

const level = ref<LevelEnum>()

const setLevel = (lvl: LevelEnum) => {
  emit('level', lvl)
  level.value = lvl
}
</script>

<template>
  <div class="actions">
    <div class="actions__levels">
      <button
        type="button"
        class="actions__level actions__level--easy"
        :class="{
          ' actions__level--active': level === LevelEnum.easy,
        }"
        @click="setLevel(LevelEnum.easy)"
        v-text="'easy'"
      />
      <button
        type="button"
        class="actions__level actions__level--hard"
        :class="{
          ' actions__level--active': level === LevelEnum.hard,
        }"
        @click="setLevel(LevelEnum.hard)"
        v-text="'hard'"
      />
      <button
        type="button"
        class="actions__level actions__level--insane"
        :class="{
          ' actions__level--active': level === LevelEnum.insane,
        }"
        @click="setLevel(LevelEnum.insane)"
        v-text="'insane'"
      />
    </div>

    <button
      type="button"
      class="actions__start"
      :disabled="startDisabled"
      @click="emit('start')"
      v-text="'start'"
    />
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
  gap: 4rem;
  margin: auto;

  button {
    border-radius: 0.25rem;
    text-transform: uppercase;
  }

  &__levels {
    display: flex;
    gap: 1rem;
  }

  &__level {
    &--easy {
      background-color: yellow;
      color: black;
    }

    &--hard {
      background-color: blue;
    }

    &--insane {
      background-color: red;
    }

    &--active {
      outline-color: white;
    }
  }

  &__start {
    background-color: green;
    font-size: 1.25rem;
  }

  &__stop {
    background-color: blue;
  }
}
</style>

<script setup lang="ts">
interface Props {
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
})

const emit = defineEmits<{
  (e: 'back'): void,
}>()

</script>

<template>
  <div class="top-bar">
    <div
      v-if="$slots.left"
      class="top-bar__left"
    >
      <slot name="left" />
    </div>
    <slot name="title">
      <p
        class="top-bar__title"
        @click="emit('back')"
      >
        <span
          v-if="title"
          v-text="title"
        />
        <span v-else>
          Game<em><b>bit</b></em>
        </span>
      </p>
    </slot>
    <div
      v-if="$slots.right"
      class="top-bar__right"
    >
      <slot name="right" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .top-bar {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;

    &__title {
      font-size: xx-large;
      text-transform: uppercase;
      flex: 1;
      font-weight: 500;
      margin: auto;
      text-align: center;
    }

    &__left,
    &__right {
      position: absolute;
      opacity: 0.7;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }

    &__left {
      left: 0;
      
    }

    &__right {
      right: 0;
    }
  }
</style>
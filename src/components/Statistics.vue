<script lang="ts" setup>
import { IconEnum } from '../types'

import Icon from '../components/Icon.vue'

import { useQuest } from '../composables'

const {
  totalFailsCount,
  killersList,
  unsetDecisionsCount,
  killersMap,
} = useQuest()
</script>

<template>
  <ul class="statistics">
    <li class="statistics__element">
      Total fails: <b>{{ totalFailsCount }}</b>
    </li>

    <li class="statistics__element">
      Wrong decisions: <b>{{ totalFailsCount - unsetDecisionsCount }}</b>
    </li>

    <li class="statistics__element">
      No decisions: <b>{{ unsetDecisionsCount }}</b>
    </li>
    
    <li v-if="killersList.length" class="statistics__element">
      Killers:
      <span class="killers">
        <span
          v-for="(value, key) in killersMap"
          class="killer"
        >
          <Icon :icon="IconEnum[key]" :size="30"/>
          <span> x <b>{{ value }}</b></span>
        </span>
      </span>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.statistics {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0;
  height: 100%;
  width: 100%;

  &__element {
    display: flex;
    margin: 0;
    gap: 1rem;

    .killers {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .killer {
      display:flex;
      align-items: center;
    }
  }
}
</style>
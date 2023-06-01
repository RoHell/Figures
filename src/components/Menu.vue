<script lang="ts" setup>
import { IconEnum } from '../types'

import Icon from '../components/Icon.vue'
import TopBar from '../components/TopBar.vue'

const emit = defineEmits<{
  (e: 'close'): void,
}>()
</script>

<template>
  <div class="menu">
    <TopBar title="Menu">
      <template #right>
        <button
          type="button"
          @click="emit('close')"
        >
          <Icon :icon="IconEnum.close" size="2rem"/>
        </button>
      </template>
    </TopBar>
  </div>
</template>

<styl lang="scss" scoped>

</styl>
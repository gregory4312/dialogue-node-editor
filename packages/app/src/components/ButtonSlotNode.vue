<script setup lang="ts">
import type { VisualSlot } from '@/types';
import { type NodeProps } from '@vue-flow/core'
import type { Button } from '@workspace/common';
import { computed, ref } from 'vue';

const props = defineProps<NodeProps<VisualSlot>>()

const buttonRef = ref<Button | null>(props.data.button ?? null)

const buttonComputed = computed({
  get: () => buttonRef?.value,
  set: (button: Button | null) => {
    buttonRef.value = button
    emit('editButton', props.data.parentSceneId, props.data.index, button)
  }
})

const emit = defineEmits<{
  (event: 'editButton', parentSceneId: string, buttonIndex: number, button: Button | null): void
}>()
</script>

<template>
  <div class="scene-node-container">
    <p>
      {{ props.data.parentSceneId }}
    </p>
    <p>
      {{ props.data.index + 1 }}
    </p>
    <!-- show button info if it exists -->
    <div v-if="buttonComputed">
      <input v-model="buttonComputed.displayName" />
      <input v-model="buttonComputed.commands" />
    </div>
  </div>
</template>

<style scoped>

</style>
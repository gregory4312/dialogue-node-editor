<script setup lang="ts">
import type { VisualSlot } from '@/types';
import { type NodeProps } from '@vue-flow/core'
import type { Button } from '@workspace/common';
import { computed, ref, watch } from 'vue';

const props = defineProps<NodeProps<VisualSlot>>()
const buttonRef = ref<Button>({ ...props.data.button })

watch(
  () => props.data.button,
  (updatedButton) => {
    buttonRef.value = { ...updatedButton }
  },
  { deep: true, immediate: true }
)

const commandText = computed({
  get: () => buttonRef.value.commands.join("\n"),
  set: (newCommands) => {
    buttonRef.value.commands = newCommands.split("\n")
    update()
  }
})

const displayName = computed({
  get: () => buttonRef.value.displayName,
  set: (newName) => {
    buttonRef.value.displayName = newName
    update()
  }
})

function update() {
  emit(
      'editButton',
      props.data.parentSceneId,
      props.data.id,
      props.data.index,
      {
        ...buttonRef.value,
        // because the reactivity causes problems
        commands: [...buttonRef.value.commands]
      }
    )
}

const emit = defineEmits<{
  (event: 'editButton', parentSceneId: string, nodeId: string, buttonIndex: number, button: Button): void
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
    <input v-model="displayName" />
    <textarea v-model="commandText" />
  </div>
</template>

<style scoped>

</style>
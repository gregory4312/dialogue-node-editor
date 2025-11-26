<script setup lang="ts">
import type { VisualSlot } from '@/types';
import { type NodeProps } from '@vue-flow/core'
import type { Button } from '@workspace/common';
import { computed, ref, watch } from 'vue';

const props = defineProps<NodeProps<VisualSlot>>()
const buttonRef = ref<Button>({ ...props.data.button })

const commandText = computed({
  get: () => buttonRef.value.commands.join("\n"),
  set: (newCommands) => buttonRef.value.commands = newCommands.split("\n")
})

watch(
  buttonRef,
  (newButton) => {
    console.log(newButton)
    emit(
      'editButton',
      props.data.parentSceneId,
      props.data.id,
      props.data.index,
      {
        ...newButton,
        // because the reactivity causes problems
        commands: [...newButton.commands]
      }
    )
  },
  { deep: true }
)
  
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
    <!-- show button info if it exists -->
    <div v-if="buttonRef">
      <input v-model="buttonRef.displayName" />
      <input v-model="commandText" />
    </div>
  </div>
</template>

<style scoped>

</style>
<script setup lang="ts">
import { useNodeDrag } from '@/composables/manualDrag';
import type { SceneCommandSlot, VisualSceneCommand } from '@/types';
import { type NodeProps } from '@vue-flow/core'
import { computed } from 'vue';

const props = defineProps<NodeProps<VisualSceneCommand>>()

const drag = useNodeDrag(props.id)

const commandsRef = computed({
  get: () => props.data.commands.join("\n"),
  set: (newCommandText: string) => {
    emit('editCommand', props.data.parentSceneId, props.data.id, props.data.type, newCommandText.split("\n"))
  }
})

const emit = defineEmits<{
  (event: 'editCommand', parentSceneId: string, nodeId: string, commandType: SceneCommandSlot, newCommands: string[]): void
}>()
</script>

<template>
  <div class="scene-node-container" @mousedown="drag.onMouseDown">
    <p>
      {{ props.data.parentSceneId }}
    </p>
    <p>
      {{ props.data.type }}
    </p>
    <!-- show button info if it exists -->
    <textarea v-model="commandsRef" />
  </div>
</template>

<style scoped>

</style>
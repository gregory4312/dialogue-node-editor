<script setup lang="ts">
import { type NodeProps } from '@vue-flow/core'
import type { Scene } from '@workspace/common';
import { computed, toRefs } from 'vue';

const props = defineProps<NodeProps<Scene>>()

// sceneId change means deleting the scene
// no need to track it
const { sceneText, npcName } = toRefs(props.data)

const sceneTextRef = computed({
  get: () => sceneText.value,
  set: (newSceneText: string) => emit('editSceneText', props.data.sceneId, newSceneText)
})

const npcNameRef = computed({
  get: () => npcName.value,
  set: (newNpcName: string) => emit('editNpcName', props.data.sceneId, newNpcName)
})

const emit = defineEmits<{
  (event: 'editNpcName', sceneId: string, newNpcName: string): void
  (event: 'editSceneText', sceneId: string, newSceneText: string): void
}>()
</script>

<template>
  <div class="scene-node-container">
    <p>
      {{ props.data.sceneId }}
    </p>
    <input v-model="npcNameRef" />
    <input v-model="sceneTextRef" />
  </div>
</template>

<style scoped>

</style>
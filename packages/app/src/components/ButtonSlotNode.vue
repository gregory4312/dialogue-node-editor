<script setup lang="ts">
import type { VisualSlot } from '@/types';
import { type NodeProps } from '@vue-flow/core'
import type { Button } from '@workspace/common';
import { ref, watch } from 'vue';

const props = defineProps<NodeProps<VisualSlot>>()


// const buttonRef = computed({
//   get: () => props.data.button,
//   set: (button: Button) => {
//     emit('editButton', props.data.parentSceneId, props.data.id, props.data.index, { ...button })
//     console.log({...button})
//   }
// })

const buttonRef = ref<Button>({ ...props.data.button })

watch(
    buttonRef,
    (newButton) => {
      emit('editButton', props.data.parentSceneId, props.data.id, props.data.index, { ...newButton })
      // console.log({...newButton})
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
      <input v-model="buttonRef.commands" />
    </div>
  </div>
</template>

<style scoped>

</style>
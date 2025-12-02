<script setup lang="ts">
import { useNodeDrag } from '@/composables/manualDrag';
import type { VisualSlot } from '@/types';
import { type NodeProps } from '@vue-flow/core'
import type { Button } from '@workspace/common';
import { ArrowUpLeft } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';

const props = defineProps<NodeProps<VisualSlot>>()

const drag = useNodeDrag(props.id)

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

// select parent
function selectParent() {
  emit("selectNode", props.data.parentSceneId)
}

const emit = defineEmits<{
  (event: 'editButton', parentSceneId: string, nodeId: string, buttonIndex: number, button: Button): void
  (event: "selectNode", nodeId: string): void
}>()

// uuids
const sceneUuid = `scene-id-${props.data.id}`
const indexUuid = `button-index-${props.data.id}`
const nameUuid = `display-name-${props.data.id}`
const commandTextUuid = `button-commands-${props.data.id}`
</script>

<template>
  <div class="button-node-container" @mousedown="drag.onMouseDown">
    <div class="button-node-header">
      <div>
        <button @click="selectParent" @mousedown.stop>
          <ArrowUpLeft />
        </button>
        <label :for=sceneUuid>
          Parent Scene:
        </label>
      </div>
      <span :id=sceneUuid>
        {{ props.data.parentSceneId }}
      </span>
  
      <label :for=indexUuid>
        Slot Index:
      </label>
      <span :id=indexUuid>
        {{ props.data.index + 1 }}
      </span>
  
      <label :for=nameUuid>
        Display Name:
      </label>
      <input :id="nameUuid" v-model="displayName" @mousedown.stop />
    </div>

    <div class="button-commands">
      <label :for="commandTextUuid">
        Commands
      </label>
      <textarea :id="commandTextUuid" v-model="commandText" @mousedown.stop />
    </div>
  </div>
</template>

<style scoped>
.button-node-container {
  background-color: rgb(142, 108, 180);
  display: flex;
  align-content: center;
  flex-direction: column;
  padding: 2ch;
}

.button-node-header {
  display: grid;
  grid-template-columns: fit-content(100px) 1fr;
  row-gap: 10px;  /* vertical spacing between rows */
  column-gap: 10px;
  align-items: center;
}

.button-commands {
  display: flex;
  column-gap: 10px;
  align-items: center;
  flex-direction: column;
}
</style>
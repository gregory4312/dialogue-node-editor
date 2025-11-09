import { useEventListener } from "@vueuse/core";

import { type Scene, type SceneMessage } from "@workspace/common"

// type SceneDelete = (sceneId: string) => void
// type SceneGeneric = (sceneId: string, scene: Scene) => void

export function useDialogueData() {
  
  // event listeners
  const listeners = {
    onSceneCreate: [] as ((sceneId: string, scene: Scene) => void)[],
    onSceneUpdate: [] as ((sceneId: string, scene: Scene) => void)[],
    onSceneDelete: [] as ((sceneId: string) => void)[]
  }


  function onSceneDelete(callback: (sceneId: string) => void) {
    listeners.onSceneDelete.push(callback)
  }

  // listening to messages from vscode
  useEventListener(window, "message", (event: MessageEvent) => {

    const messageData = event.data as SceneMessage

    // first check what type of message it is
    switch (messageData.messageType) {
      case "createScene":
      case "updateScene":
      case "deleteScene":
        listeners.onSceneDelete.forEach(fn => fn(messageData.sceneId))
    }
  })

  return { onSceneDelete }
}

// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import { Scene } from "@workspace/common"
import deepEqual from "fast-deep-equal"
import { DialogueStoreDeleteMessage, DialogueStoreGenericMessage, StoreUpdateSource } from "../storeMessages"

class DialogueStore {
  private dialogueMap = new Map<string, Scene>()
  
  private listeners = {
    onSceneCreate: [] as ((storeMessage: DialogueStoreGenericMessage) => void)[],
    onSceneUpdate: [] as ((storeMessage: DialogueStoreGenericMessage) => void)[],
    onSceneDelete: [] as ((storeMessage: DialogueStoreDeleteMessage) => void)[]
  }

  public onSceneCreate(callback: (storeMessage: DialogueStoreGenericMessage) => void) {
    this.listeners.onSceneCreate.push(callback)
  }

  public onSceneUpdate(callback: (storeMessage: DialogueStoreGenericMessage) => void) {
    this.listeners.onSceneUpdate.push(callback)
  }

  public onSceneDelete(callback: (storeMessage: DialogueStoreDeleteMessage) => void) {
    this.listeners.onSceneDelete.push(callback)
  }

  /**
   * Adds a scene to the store, updating it if it already exists.
   * @param source The source of the information.
   * @param scene The updated scene.
   */
  public upsertScene(source: StoreUpdateSource, scene: Scene) {
    const sceneTag = scene.sceneId
    const existingScene = this.dialogueMap.get(sceneTag)

    const isNew = !existingScene
    const isIdentical = deepEqual(scene, existingScene)
    // don't emit anything if it's the same
    if (isIdentical) {
      return
    }

    // otherwise it'll be an update
    this.dialogueMap.set(sceneTag, scene)

    // it might be a completely new scene if a bug happened, allow it anyway
    if (isNew) {
      const createSceneMessage: DialogueStoreGenericMessage = {
        messageSource: source,
        messageType: "createScene",
        sceneData: scene,
        sceneId: sceneTag
      }
      this.listeners.onSceneCreate.forEach(fn => fn(createSceneMessage))
    } else {
      const updateSceneMessage: DialogueStoreGenericMessage = {
        messageSource: source,
        messageType: "updateScene",
        sceneData: scene,
        sceneId: sceneTag
      }
      this.listeners.onSceneUpdate.forEach(fn => fn(updateSceneMessage))
    }
  }

  /**
   * Deletes a scene from the store, emitting to `onSceneDelete` on sucessful deletion.
   * @param source The source of the information.
   * @param sceneTag The tag of the scene to be deleted from the store.
   */
  public deleteScene(source: StoreUpdateSource, sceneTag: string) {
    const elementExisted = this.dialogueMap.delete(sceneTag)

    // don't emit if the scene wasn't even there
    if (!elementExisted) {
      return
    }

    // send the message to listeners
    const deleteMessage: DialogueStoreDeleteMessage = {
      messageType: "deleteScene",
      sceneId: sceneTag,
      messageSource: source
    }
    this.listeners.onSceneDelete.forEach(fn => fn(deleteMessage))
  }

  public getScenes() {
    return Array.from(this.dialogueMap.values())
  }

}

const dialogueStore = new DialogueStore()
export default dialogueStore

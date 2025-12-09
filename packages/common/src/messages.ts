// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import { Scene } from "./types"

export type SceneMessage = GenericSceneMessage | DeleteSceneMessage
export type GenericMessage = SceneMessage | ReadyMessage | ConfigMessage

interface BaseMessage {
  /**
   * The scene identifier.
   * 
   * @remarks
   * Is the `scene_tag` in JSON definition.
   */
  sceneId: string
}

export interface GenericSceneMessage extends BaseMessage {
  messageType: "createScene" | "updateScene"
  /**
   * Scene object.
   */
  sceneData: Scene
}

export interface DeleteSceneMessage extends BaseMessage {
  messageType: "deleteScene"
}

export interface ReadyMessage {
  /**
   * Is ready.
   */
  isReadyStatus: boolean
  messageType: "ready"
}

export interface ConfigMessage {
  messageType: "config",
  /**
   * Colour code for scene nodes.
   */
  sceneNodeColour: string,
  /**
   * Colour code for button slot nodes.
   */
  buttonSlotNodeColour: string,
  /**
   * Colour code for command nodes.
   */
  commandNodeColour: string,
}

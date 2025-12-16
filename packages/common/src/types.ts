// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import { SceneMessage } from "./messages"

/**
 * Represents an NPC dialogue scene.
 */
export interface Scene {
  /**
   * The scene identifier.
   * 
   * @remarks
   * Is the `scene_tag` in JSON definition.
   */
  sceneId: string
  /**
   * The name of the NPC in the dialogue view.
   * 
   * @remarks
   * Is `npc_name` in JSON definition.
   */
  npcName: string
  /**
   * The text displayed by the NPC.
   */
  sceneText: string
  /**
   * The commands that will be run by the NPC upon opening the dialogue screen.
   */
  openCommands: string[]
  /**
   * The commands that will be run by the NPC upon closing the dialogue screen.
   */
  closeCommands: string[]
  /**
   * Buttons displayed on the dialogue screen.
   * 
   * @remarks
   * There is a maximum of `6` buttons per scene.
   */
  buttons: Button[]
}

/**
 * Represents a selectable button in NPC dialogue.
 */
export interface Button {
  /**
   * The text displayed on the button.
   */
  displayName: string
  /**
   * The commands that the NPC will run upon the player selecting the button.
   */
  commands: string[]
}

/**
 * Maximum number of buttons per scene.
 */
export const SCENE_MAX_BUTTONS = 6

/**
 * An object that can send messages back and forth between extension and webview.
 */
export interface MessageSender {
  /**
   * Sends the message.
   * @param message 
   */
  sendMessage(message: SceneMessage): void
}

/**
 * Metadata for tracking rawtext translation keys
 */
export interface RawtextMetadata {
  npcNameKey?: string | null
  textKey?: string | null
  textWithValues?: string[] | null
  nameKey?: string | null
}


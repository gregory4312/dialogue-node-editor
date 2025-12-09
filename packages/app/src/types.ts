// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import type { Button } from "@workspace/common";

/**
 * The ways data can change.
 */
export type DataChangeCategory = "created" | "modified" | "deleted"

export type LogicalSceneDataChange = SceneCommandDataChange | ButtonSlotDataChange

export interface SceneCommandDataChange {
  readonly kind: "sceneCommand"
  /**
   * Unique identifier.
   */
  readonly id: string
  /**
   * Whether the command runs on scene open or scene close.
   */
  readonly type: SceneCommandSlot,
  /**
   * The type of change.
   */
  readonly change: DataChangeCategory
}

export interface ButtonSlotDataChange {
  readonly kind: "button"
  /**
   * Uuid of this slot.
   */
  readonly id: string
  /**
   * The slot's index, starting from 0.
   */
  readonly index: number
  /**
   * The type of change.
   */
  readonly change: DataChangeCategory
  /**
   * Whether the slot is now the highest currently enabled index.
   */
  readonly highestIndex: boolean | null
}

/**
 * Possible child nodes a logical scene can have.
 */
export type SceneFunctionSlot = SceneCommandSlot | SceneButtonSlot

/**
 * Possible button slots a logical scene can have.
 * 
 * @todo
 * This is a hardcoded 6 button limit.
 * Ensure this is kept up to date.
 */
export type SceneButtonSlot = "1" | "2" | "3" | "4" | "5" | "6"

/**
 * Open and close commands.
 */
export type SceneCommandSlot = "open" | "close"

/**
 * Node info that is saved to persistent state.
 */
export type NodeStateOptions =
{
  nodeType: "scene"
} | {
  nodeType: "command"
  slot: SceneCommandSlot
} | {
  nodeType: "button"
  slot: number
}

/**
 * Visual representation of a scene.
 */
export interface VisualScene {
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
   * The uuid of the scene's open command node.
   */
  openCommandNode?: string
  /**
   * The uuid of the scene's close command node.
   */
  closeCommandNode?: string
  /**
   * The uuids of the scene's button nodes.
   * 
   * @remarks
   * There is a maximum of `6` buttons per scene.
   */
  buttonNodes: string[]
}

export interface VisualSceneCommand {
  /**
   * Unique identifier.
   */
  readonly id: string
  /**
   * Whether the command runs on scene open or scene close.
   */
  type: SceneCommandSlot,
  /**
   * The identifier of the slot's parent scene.
   * 
   * @remarks
   * Is the `scene_tag` in JSON definition.
   */
  readonly parentSceneId: string
  /**
   * The commands that the NPC will run on scene open/close.
   */
  commands: string[]
}

export interface VisualSlot {
  readonly type: "buttonSlot"
  /**
   * Uuid of this slot.
   */
  readonly id: string
  /**
   * The identifier of the slot's parent scene.
   * 
   * @remarks
   * Is the `scene_tag` in JSON definition.
   */
  readonly parentSceneId: string
  /**
   * The slot's index, starting from 0.
   */
  index: number
  /**
   * The current button in this slot.
   */
  button: Button
  /**
   * Whether the slot is the highest currently enabled index.
   */
  highestIndex: boolean
}

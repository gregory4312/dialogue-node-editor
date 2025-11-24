// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import type { Button } from "@workspace/common";

/**
 * The ways data can change.
 */
export type DataChangeCategory = "created" | "modified" | "deleted"

export type VisualSceneDataChange = SceneCommandDataChange | ButtonSlotDataChange

export interface SceneCommandDataChange {
  kind: "sceneCommand"
  /**
   * Unique identifier.
   */
  id: string
  /**
   * Whether the command runs on scene open or scene close.
   */
  type: SceneCommandSlot,
  /**
   * The type of change.
   */
  change: DataChangeCategory
}

export interface ButtonSlotDataChange {
  kind: "button"
  /**
   * Uuid of this slot.
   */
  id: string
  /**
   * The slot's index, starting from 0.
   */
  index: number
  /**
   * The type of change.
   */
  change: DataChangeCategory
}

/**
 * Possible child nodes a visual scene can have.
 */
export type SceneFunctionSlot = SceneCommandSlot | SceneButtonSlot

/**
 * Possible button slots a visual scene can have.
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

export interface VisualSceneCommand {
  /**
   * Unique identifier.
   */
  id: string
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
  parentSceneId: string
  /**
   * The commands that the NPC will run on scene open/close.
   */
  commands: string[]
}

export interface VisualSlot {
  /**
   * Uuid of this slot.
   */
  id: string
  /**
   * The identifier of the slot's parent scene.
   * 
   * @remarks
   * Is the `scene_tag` in JSON definition.
   */
  parentSceneId: string
  /**
   * The slot's index, starting from 0.
   */
  index: number
  /**
   * The current button in this slot.
   */
  button?: Button
}

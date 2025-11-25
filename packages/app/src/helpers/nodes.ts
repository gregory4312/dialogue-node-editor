// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import type { VisualSceneCommand, VisualSlot } from "@/types";
import type { Node, XYPosition } from "@vue-flow/core";
import type { Scene } from "@workspace/common";

const defaultLocation: XYPosition = {
  x: 0,
  y: 0
}

/**
 * Creates a node of type `scene`.
 */
export function toSceneNode(scene: Scene, location: XYPosition = defaultLocation) {
  const sceneNode: Node<Scene> = {
    id: scene.sceneId,
    position: location,
    data: scene,
    type: "scene"
  }
  return sceneNode
}

/**
 * Creates a node of type `button-slot`.
 */
export function toSlotNode(slot: VisualSlot, location: XYPosition = defaultLocation) {
  const slotNode: Node<VisualSlot> = {
    id: slot.id,
    position: location,
    data: slot,
    type: "button-slot"
  }
  return slotNode
}

/**
 * Creates a node of type `scene-command`.
 */
export function toCommandNode(sceneCommand: VisualSceneCommand, location: XYPosition = defaultLocation) {
  const commandNode: Node<VisualSceneCommand> = {
    id: sceneCommand.id,
    position: location,
    data: sceneCommand,
    type: "scene-command"
  }
  return commandNode
}

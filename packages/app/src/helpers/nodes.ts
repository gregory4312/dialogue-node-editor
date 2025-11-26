// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import type { VisualScene, VisualSceneCommand, VisualSlot } from "@/types";
import type { Node, XYPosition } from "@vue-flow/core";

const defaultLocation: XYPosition = {
  x: 0,
  y: 0
}

/**
 * Creates a node of type `scene`.
 */
export function toSceneNode(scene: VisualScene, location: XYPosition = defaultLocation) {
  const sceneNode: Node<VisualScene> = {
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
 * Creates a node of type `command-slot`.
 */
export function toCommandNode(sceneCommand: VisualSceneCommand, location: XYPosition = defaultLocation) {
  const commandNode: Node<VisualSceneCommand> = {
    id: sceneCommand.id,
    position: location,
    data: sceneCommand,
    type: "command-slot"
  }
  return commandNode
}

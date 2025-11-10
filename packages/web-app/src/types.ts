// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import type { Button, Scene } from "@workspace/common";

export interface VisualButton extends Button {
  /**
   * Uuid for the button, used for VueFlow.
   */
  id: string
  /**
   * The identifier of the button's parent scene.
   * 
   * @remarks
   * Is the `scene_tag` in JSON definition.
   */
  parentSceneId: string
}

export interface VisualScene extends Omit<Scene, "buttons"> {
  /**
   * Buttons displayed on the dialogue screen.
   * 
   * @remarks
   * Contains extra identification information.
   * 
   * There is a maximum of `6` buttons per scene.
   */
  buttons: VisualButton[]
}

export interface VisualSlot {
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

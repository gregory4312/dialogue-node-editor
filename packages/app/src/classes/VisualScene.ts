// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import type { SceneCommandSlot, VisualSceneCommand, VisualSlot } from "@/types";
import type { Button, Scene } from "@workspace/common";
import { v4 as uuidv4 } from 'uuid'

export class VisualScene implements Scene {
  
  /**
   * Map of button slots to their node ids.
   * 
   * @remarks
   * First slot has index 0.
   */
  private buttonMap: Map<number, VisualSlot>
  private commandMap: Map<SceneCommandSlot, VisualSceneCommand>

  private constructor(
    public buttons: Button[],
    public closeCommands: string[],
    public npcName: string,
    public openCommands: string[],
    public sceneId: string,
    public sceneText: string,
    commandMap: Map<SceneCommandSlot, VisualSceneCommand>,
    buttonMap: Map<number, VisualSlot>
  ) {
    this.buttonMap = buttonMap
    this.commandMap = commandMap
  }

  /**
   * Creates a new visual scene from a scene.
   * @param scene The raw scene.
   * @returns A new visual scene.
   * 
   * @remarks
   * This must not be used to update an existing scene.
   */
  public static fromScene(scene: Scene): VisualScene {
    // making ids for the buttons
    const buttonMap = new Map<number, VisualSlot>()
    const buttons = scene.buttons
    buttons.forEach((button, index) => {
      const uuid = uuidv4()
      const buttonSlot: VisualSlot = {
        index,
        button,
        parentSceneId: scene.sceneId,
        id: uuid
      }
      buttonMap.set(index, buttonSlot)
    })

    // now for the open/close commands
    const commandMap = new Map<SceneCommandSlot, VisualSceneCommand>()
    const openCommand: VisualSceneCommand = {
      commands: scene.openCommands,
      id: uuidv4(),
      parentSceneId: scene.sceneId,
      type: "open"
    }
    const closeCommand: VisualSceneCommand = {
      commands: scene.closeCommands,
      id: uuidv4(),
      parentSceneId: scene.sceneId,
      type: "close"
    }
    commandMap.set("close", closeCommand)
    commandMap.set("open", openCommand)

    // now that all the ids are made, we can create the visual scene
    const visualScene = new VisualScene(
      scene.buttons,
      scene.closeCommands,
      scene.npcName,
      scene.openCommands,
      scene.sceneId,
      scene.sceneText,
      commandMap,
      buttonMap
    )
    return visualScene
  }

}

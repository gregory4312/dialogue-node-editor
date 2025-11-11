// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

/**
 * Data representation of dialogue file.
 */
export interface DialogueData {
  format_version: string
  "minecraft:npc_dialogue": { scenes: SceneData[] }
}

/**
 * Data representation of scene JSON.
 */
export interface SceneData {
  scene_tag: string
  npc_name?: string
  text?: string
  on_open_commands?: string[]
  on_close_commands?: string[]
  buttons?: ButtonData[]
}

/**
 * Data representation of button JSON.
 */
export interface ButtonData {
  name: string
  commands: string[]
}

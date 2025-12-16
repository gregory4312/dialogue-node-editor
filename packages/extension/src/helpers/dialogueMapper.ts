// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import { Scene, Button } from '@workspace/common';
import { SceneData, ButtonData } from '../../../common/src/rawDataTypes';
import { LangFileData } from './langFileParser';
import { resolveTextField, isRawtext, getTranslationKey } from './rawtextHelper';

/**
 * Converts SceneData from JSON to Scene object for the editor
 * @param sceneData The scene data from JSON
 * @param langData Optional lang file data for resolving rawtext
 */
export function fromSceneData(sceneData: SceneData, langData?: LangFileData | null): Scene {
  // Resolve text fields (they might be rawtext objects)
  const npcName = resolveTextField(sceneData.npc_name, langData || null);
  const text = resolveTextField(sceneData.text, langData || null);
  
  // Convert buttons
  const buttons: Button[] = (sceneData.buttons || []).map(btn => fromButtonData(btn, langData));
  
  // Store original rawtext keys as metadata for editing
  const scene: Scene = {
    sceneId: sceneData.scene_tag,
    npcName: npcName,
    text: text,
    onOpenCommands: sceneData.on_open_commands || [],
    onCloseCommands: sceneData.on_close_commands || [],
    buttons: buttons,
    // Store rawtext keys for later conversion back to JSON
    _rawtextMetadata: {
      npcNameKey: isRawtext(sceneData.npc_name) ? getTranslationKey(sceneData.npc_name) : null,
      textKey: isRawtext(sceneData.text) ? getTranslationKey(sceneData.text) : null,
      textWithValues: isRawtext(sceneData.text) && sceneData.text.rawtext[0].with || null
    }
  };
  
  return scene;
}

/**
 * Converts ButtonData from JSON to Button object
 */
function fromButtonData(buttonData: ButtonData, langData?: LangFileData | null): Button {
  const name = resolveTextField(buttonData.name, langData || null);
  
  return {
    buttonId: '', // Will be generated in the editor
    name: name,
    commands: buttonData.commands,
    _rawtextMetadata: {
      nameKey: isRawtext(buttonData.name) ? getTranslationKey(buttonData.name) : null
    }
  };
}

/**
 * Converts Scene object back to SceneData for JSON
 */
export function toSceneData(scene: Scene): SceneData {
  // Check if we should use rawtext or plain strings
  const useRawtextForNpcName = scene._rawtextMetadata?.npcNameKey !== null;
  const useRawtextForText = scene._rawtextMetadata?.textKey !== null;
  
  const sceneData: SceneData = {
    scene_tag: scene.sceneId
  };
  
  // Handle npc_name
  if (scene.npcName) {
    if (useRawtextForNpcName && scene._rawtextMetadata?.npcNameKey) {
      sceneData.npc_name = {
        rawtext: [{
          translate: scene._rawtextMetadata.npcNameKey
        }]
      };
    } else {
      sceneData.npc_name = scene.npcName;
    }
  }
  
  // Handle text
  if (scene.text) {
    if (useRawtextForText && scene._rawtextMetadata?.textKey) {
      sceneData.text = {
        rawtext: [{
          translate: scene._rawtextMetadata.textKey,
          ...(scene._rawtextMetadata.textWithValues ? { with: scene._rawtextMetadata.textWithValues } : {})
        }]
      };
    } else {
      sceneData.text = scene.text;
    }
  }
  
  // Handle commands
  if (scene.onOpenCommands && scene.onOpenCommands.length > 0) {
    sceneData.on_open_commands = scene.onOpenCommands;
  }
  
  if (scene.onCloseCommands && scene.onCloseCommands.length > 0) {
    sceneData.on_close_commands = scene.onCloseCommands;
  }
  
  // Handle buttons
  if (scene.buttons && scene.buttons.length > 0) {
    sceneData.buttons = scene.buttons.map(btn => toButtonData(btn));
  }
  
  return sceneData;
}

/**
 * Converts Button object back to ButtonData for JSON
 */
function toButtonData(button: Button): ButtonData {
  const useRawtextForName = button._rawtextMetadata?.nameKey !== null;
  
  const buttonData: ButtonData = {
    name: useRawtextForName && button._rawtextMetadata?.nameKey
      ? {
          rawtext: [{
            translate: button._rawtextMetadata.nameKey
          }]
        }
      : button.name,
    commands: button.commands
  };
  
  return buttonData;
}

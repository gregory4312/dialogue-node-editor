// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

/**
 * Represents the translation data from a .lang file
 */
export interface LangFileData {
  [key: string]: string
}

/**
 * Parses a .lang file and returns key-value pairs
 */
export function parseLangFile(fileContent: string): LangFileData {
  const translations: LangFileData = {};
  const lines = fileContent.split('\n');
  
  for (const line of lines) {
    // Skip empty lines and comments
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('//')) {
      continue;
    }
    
    // Parse key=value pairs
    const equalIndex = trimmedLine.indexOf('=');
    if (equalIndex > 0) {
      const key = trimmedLine.substring(0, equalIndex).trim();
      const value = trimmedLine.substring(equalIndex + 1).trim();
      translations[key] = value;
    }
  }
  
  return translations;
}

/**
 * Finds the RP/texts/en_US.lang file relative to a dialogue file
 * @param dialogueFilePath The path to the dialogue file (in BP/dialogues)
 * @returns Path to the lang file if found, null otherwise
 */
export function findLangFile(dialogueFilePath: vscode.Uri): string | null {
  try {
    const dialogueFsPath = dialogueFilePath.fsPath;
    const bpIndex = dialogueFsPath.indexOf('BP');
    
    if (bpIndex === -1) {
      return null;
    }
    
    // Get the base directory
    const baseDir = dialogueFsPath.substring(0, bpIndex);
    const langFilePath = path.join(baseDir, 'RP', 'texts', 'en_US.lang');
    
    // Check if file exists
    if (fs.existsSync(langFilePath)) {
      return langFilePath;
    }
    
    return null;
  } catch (error) {
    console.error('Error finding lang file:', error);
    return null;
  }
}

/**
 * Loads and parses the lang file for a given dialogue file
 */
export async function loadLangFile(dialogueFilePath: vscode.Uri): Promise<LangFileData | null> {
  const langFilePath = findLangFile(dialogueFilePath);
  
  if (!langFilePath) {
    return null;
  }
  
  try {
    const content = fs.readFileSync(langFilePath, 'utf-8');
    return parseLangFile(content);
  } catch (error) {
    console.error('Error loading lang file:', error);
    return null;
  }
}

/**
 * Resolves a translation key to its value
 * @param translationKey The key to resolve
 * @param langData The loaded lang file data
 * @param withValues Optional array of values to substitute in the translation
 * @returns The resolved text or the key if not found
 */
export function resolveTranslation(
  translationKey: string,
  langData: LangFileData | null,
  withValues?: string[]
): string {
  if (!langData) {
    return `[MISSING LANG FILE: ${translationKey}]`;
  }
  
  let translation = langData[translationKey];
  
  if (!translation) {
    return `[MISSING KEY: ${translationKey}]`;
  }
  
  // Handle 'with' parameter substitutions
  if (withValues && withValues.length > 0) {
    withValues.forEach((value, index) => {
      // Replace %<index> placeholders with values
      const placeholder = `%${index}`;
      translation = translation.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    });
  }
  
  return translation;
}

/**
 * Updates a translation in the lang file
 * @param langFilePath Path to the lang file
 * @param key Translation key to update
 * @param value New value
 * @returns true if successful, false otherwise
 */
export async function updateLangFile(
  langFilePath: string,
  key: string,
  value: string
): Promise<boolean> {
  try {
    const content = fs.readFileSync(langFilePath, 'utf-8');
    const lines = content.split('\n');
    let found = false;
    
    // Update existing key or add new one
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith(key + '=')) {
        lines[i] = `${key}=${value}`;
        found = true;
        break;
      }
    }
    
    if (!found) {
      // Add new key at the end
      lines.push(`${key}=${value}`);
    }
    
    fs.writeFileSync(langFilePath, lines.join('\n'), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error updating lang file:', error);
    return false;
  }
}

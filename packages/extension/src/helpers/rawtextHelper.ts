// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import { RawtextObject, RawtextComponent } from '../../../common/src/rawDataTypes';
import { LangFileData, resolveTranslation } from './langFileParser';

/**
 * Checks if a value is a rawtext object
 */
export function isRawtext(value: any): value is RawtextObject {
  return (
    value &&
    typeof value === 'object' &&
    'rawtext' in value &&
    Array.isArray(value.rawtext)
  );
}

/**
 * Resolves a rawtext object to its translated string
 */
export function resolveRawtext(
  rawtext: RawtextObject,
  langData: LangFileData | null
): string {
  if (!rawtext.rawtext || rawtext.rawtext.length === 0) {
    return '';
  }
  
  // For now, handle the common case of a single translation component
  const component = rawtext.rawtext[0];
  
  if ('translate' in component) {
    return resolveTranslation(component.translate, langData, component.with);
  }
  
  return '[INVALID RAWTEXT]';
}

/**
 * Converts a string to a rawtext object with a translation key
 */
export function createRawtext(translationKey: string, withValues?: string[]): RawtextObject {
  const component: RawtextComponent = {
    translate: translationKey
  };
  
  if (withValues && withValues.length > 0) {
    component.with = withValues;
  }
  
  return {
    rawtext: [component]
  };
}

/**
 * Extracts the translation key from a rawtext object
 */
export function getTranslationKey(rawtext: RawtextObject): string | null {
  if (!rawtext.rawtext || rawtext.rawtext.length === 0) {
    return null;
  }
  
  const component = rawtext.rawtext[0];
  return component.translate || null;
}

/**
 * Converts text field to display format (resolves rawtext if needed)
 * @param value The text value (can be string or rawtext)
 * @param langData The loaded lang file data
 * @returns Resolved text string
 */
export function resolveTextField(
  value: string | RawtextObject | undefined,
  langData: LangFileData | null
): string {
  if (!value) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (isRawtext(value)) {
    return resolveRawtext(value, langData);
  }
  
  return '';
}

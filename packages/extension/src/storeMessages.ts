// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import { DeleteSceneMessage, GenericSceneMessage } from "@workspace/common";

/**
 * The source of the store update.
 */
export enum StoreUpdateSource {
  /**
   * The store was updated from the extension.
   */
  Extension,
  /**
   * The store was updated from the webview.
   */
  Webview
}

/**
 * Messages emitted from the dialogue store.
 */
export type DialogueStoreMessage = DialogueStoreGenericMessage | DialogueStoreDeleteMessage

export interface DialogueStoreGenericMessage extends GenericSceneMessage {
  /**
   * The source of the store update.
   */
  messageSource: StoreUpdateSource
}

export interface DialogueStoreDeleteMessage extends DeleteSceneMessage {
  /**
   * The source of the store update.
   */
  messageSource: StoreUpdateSource
}

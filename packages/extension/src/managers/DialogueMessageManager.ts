// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import { ExtensionContext, TextDocument, WebviewPanel, window, workspace } from "vscode"
import { DialogueStore } from "../stores/dialogueStore"
import { getWebviewContent } from "../helpers/webviewHelper"
import { fromDialogue, parseRawDialogue, toDialogue } from "../helpers/dialogueParser"
import { DialogueStoreDeleteMessage, DialogueStoreGenericMessage, StoreUpdateSource } from "../storeMessages"
import { DeleteSceneMessage, GenericSceneMessage, GenericMessage, ConfigMessage } from "@workspace/common"
import { DialogueDocument, DialogueFileFormatSettings } from "../wrappers/DialogueDocument"
import { DIALOGUE_FILE_FORMAT_VERSION } from "../constants"
import { MessageQueue } from "../classes/MessageQueue"
import { useConfigMessage } from "../helpers/configMessage"
import { loadLangFile, LangFileData } from "../helpers/langFileParser"

const { createCurrentConfigMessage } = useConfigMessage()

class DialogueMessageManager {

   private dialogueStoreMap = new Map<string, DialogueStore>()
  private langDataMap = new Map<string, LangFileData | null>()

  public async initialiseConnection(context: ExtensionContext, dialogueTextDocument: TextDocument, webviewPanel: WebviewPanel) {

    // a store specifically for this file
    const store = this.getDialogueStore(dialogueTextDocument.uri.toString())
    const messageQueue = new MessageQueue(message => webviewPanel.webview.postMessage(message))

    // Load lang file for rawtext support
    const langData = await loadLangFile(dialogueTextDocument.uri)
    this.langDataMap.set(dialogueTextDocument.uri.toString(), langData)
    
    if (langData) {
      console.log('Loaded lang file with', Object.keys(langData).length, 'translations')
    } else {
      console.warn('No lang file found for dialogue file:', dialogueTextDocument.uri.fsPath)
      window.showWarningMessage('No translation file (en_US.lang) found. Rawtext translations will not be resolved.')
    }

    // allow scripts (quite important)
    webviewPanel.webview.options = {
      enableScripts: true
    }

    // initialise
    const webviewContent = getWebviewContent(webviewPanel.webview, context.extensionUri)
    webviewPanel.webview.html = webviewContent


    /////////////////////
    // ROUTED TO STORE //
    /////////////////////

    // message sender for changes to our document
    const textDocumentListener = workspace.onDidChangeTextDocument(async event => {
      // check if it's our one
      const newDocument = event.document
      const isSelectedDocument = (newDocument.uri.toString() === dialogueTextDocument.uri.toString())
      if (!isSelectedDocument) {
        return
      }

      // try to parse it
      const documentText = newDocument.getText()
      const maybeParsedText = parseRawDialogue(documentText)

      if (!maybeParsedText) {
        console.error("JSON parsing failed!!!")
        window.showErrorMessage("JSON parsing failed!!! From file `DialogueMessageManager`")
        throw new Error("JSON parsing failed!!!")
      }

      // if we make it here, then we parsed it successfully
      // now convert it to internal format with lang data
      const documentUri = dialogueTextDocument.uri.toString()
      const langData = this.langDataMap.get(documentUri)
      const sceneArray = fromDialogue(maybeParsedText, langData)
      store.setScenes(StoreUpdateSource.Extension, sceneArray)
    })

    // message sender for webview messages
    const webviewListener = webviewPanel.webview.onDidReceiveMessage(message => {
      const webviewMessage = message as GenericMessage

      if (webviewMessage.messageType === "deleteScene") {
        store.deleteScene(StoreUpdateSource.Webview, webviewMessage.sceneId)
      } else if (webviewMessage.messageType === "ready") {
        messageQueue.setReady(false) // shouldn't be neccessary, but just for safety

        // queue ALL current scenes to be created again
        const refreshMessages = store.getSceneMessages()
        for (const refreshMessage of refreshMessages) {
          messageQueue.enqueueMessage(refreshMessage)
        }

        const configMessage = createCurrentConfigMessage()
        messageQueue.enqueueMessage(configMessage)

        messageQueue.setReady(true)
      } else if (webviewMessage.messageType === "createScene" || webviewMessage.messageType === "updateScene") {
        store.upsertScene(StoreUpdateSource.Webview, webviewMessage.sceneData)
      }
    })

    ///////////////////////
    // ROUTED FROM STORE //
    ///////////////////////

    // update message handler
    const handleCreateUpdateMessage = (storeMessage: DialogueStoreGenericMessage) => {
      const { messageSource, messageType, sceneData, sceneId } = storeMessage

      // send the message to webview
      if (messageSource === StoreUpdateSource.Extension) {
        const message: GenericSceneMessage = {
          messageType,
          sceneData,
          sceneId
        }
        messageQueue.enqueueMessage(message)

      // otherwise it needs to be an update to the text document
      } else {

        // default tab size is 4
        const tabSizeSetting = workspace.getConfiguration("editor").get<number>("tabSize") ?? 4
        const setting: DialogueFileFormatSettings = {
          prettify: true,
          indentationSize: tabSizeSetting
        } 

        const dialogueDocument = new DialogueDocument(dialogueTextDocument, setting)
        const scenes = store.getScenes()

        if (!scenes) {
          console.error("NULL value was passed!!! THIS IS A BUG!!!")
          window.showErrorMessage("NULL value was passed!!! THIS IS A BUG!!! From file `DialogueMessageManager`")
          throw new Error("NULL value was passed!!! THIS IS A BUG!!!")
        }

        const dialogueData = toDialogue(scenes, DIALOGUE_FILE_FORMAT_VERSION)

        dialogueDocument.setDialogueText(dialogueData)
      }
    }

    // listeners
    const createListener = store.onSceneCreate(handleCreateUpdateMessage)
    const updateListener = store.onSceneUpdate(handleCreateUpdateMessage)

    // deletions
    const handleDeleteMessage = (storeMessage: DialogueStoreDeleteMessage) => {
      const { messageSource, sceneId, messageType } = storeMessage

      // send to webview
      if (messageSource === StoreUpdateSource.Extension) {
        const message: DeleteSceneMessage = {
          messageType,
          sceneId
        }
        messageQueue.enqueueMessage(message)
      
      // otherwise update document
      } else {

        // default tab size is 4
        const tabSizeSetting = workspace.getConfiguration("editor").get<number>("tabSize") ?? 4
        const setting: DialogueFileFormatSettings = {
          prettify: true,
          indentationSize: tabSizeSetting
        } 

        const dialogueDocument = new DialogueDocument(dialogueTextDocument, setting)
        const scenes = store.getScenes()

        if (!scenes) {
          console.error("NULL value was passed!!! THIS IS A BUG!!!")
          window.showErrorMessage("NULL value was passed!!! THIS IS A BUG!!! From file `DialogueMessageManager`")
          throw new Error("NULL value was passed!!! THIS IS A BUG!!!")
        }

        const dialogueData = toDialogue(scenes, DIALOGUE_FILE_FORMAT_VERSION)

        dialogueDocument.setDialogueText(dialogueData)
      }
    }

    const deleteListener = store.onSceneDelete(handleDeleteMessage)

    /////////////////////
    //// READY STATE ////
    /////////////////////

    // not ready when the panel is put into the background
    const visibilityListener = webviewPanel.onDidChangeViewState(event => {
      const isVisible = event.webviewPanel.visible
      if (!isVisible) {
        messageQueue.setReady(false)
      }
    })

    ///////////////////////
    //// COLOUR CONFIG ////
    ///////////////////////

    const configListener = workspace.onDidChangeConfiguration((event) => {
      const configChange = event.affectsConfiguration("bedrockDialogueEditor.nodeColors")
      if (configChange) {
        const configColoursMessage = createCurrentConfigMessage()
        messageQueue.enqueueMessage(configColoursMessage)
      }
    })

    const themeChangeListener = window.onDidChangeActiveColorTheme(_theme => {
      const configColoursMessage = createCurrentConfigMessage()
      messageQueue.enqueueMessage(configColoursMessage)
    })

    //////////////////////
    ////// CLEAN UP //////
    //////////////////////

    webviewPanel.onDidDispose(() => {
      visibilityListener.dispose()
      webviewListener.dispose()
      textDocumentListener.dispose()
      createListener.dispose()
      updateListener.dispose()
      deleteListener.dispose()
      configListener.dispose()
      themeChangeListener.dispose()
      this.queueDeleteDialogueStore(dialogueTextDocument.uri.toString())
    })

    /////////////////////////////////////////////////////////////
    //// INITIALISE AFTER ALL EVENT LISTENERS ARE SUBSCRIBED ////
    /////////////////////////////////////////////////////////////

    // initialise the content
    const initialDocumentText = dialogueTextDocument.getText()
    const initialMaybeParsedText = parseRawDialogue(initialDocumentText)
    if (initialMaybeParsedText) {
      const initialParsedText = initialMaybeParsedText
      // now we have real scenes
      const initialScenes = fromDialogue(initialParsedText)
      store.setScenes(StoreUpdateSource.Extension, initialScenes)
    } else {
      console.error("JSON parsing failed!!!")
      window.showErrorMessage("JSON parsing failed!!! From file `DialogueMessageManager`")
    }
  }

  private queueDeleteDialogueStore(fileUri: string) {
    const exists = this.dialogueStoreMap.has(fileUri)
    if (exists) {
      return
    }

    // TODO: add queue functionality
    // low priority
    this.dialogueStoreMap.delete(fileUri)
  }

  /**
   * Gets a dialogue store, creating a new one if it doesn't exist.
   */
  private getDialogueStore(documentUri: string): DialogueStore {
    let dialogueStore = this.dialogueStoreMap.get(documentUri)
    if (!dialogueStore) {
      dialogueStore = new DialogueStore()
      this.dialogueStoreMap.set(documentUri, dialogueStore)
    }
    return dialogueStore
  }

}

const dialogueMessageManager = new DialogueMessageManager()
export default dialogueMessageManager

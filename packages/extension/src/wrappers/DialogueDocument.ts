// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import { DialogueData } from '@workspace/common';
import * as vscode from 'vscode';

export interface DialogueFileFormatSettings {
  /**
   * Whether output JSON should be prettified.
   */
  prettify: boolean
  /**
   * Number of spaces for indentation the output file should use.
   * 
   * @remarks
   * Defaults to 4.
   */
  indentationSize: number
}

/**
 * Wrapper class for dialogue documents.
 */
export class DialogueDocument {
  private document: vscode.TextDocument
  private config: DialogueFileFormatSettings

  constructor(document: vscode.TextDocument, formatOptions?: DialogueFileFormatSettings) {
    this.document = document

    // default settings
    if (!formatOptions) {
      formatOptions = {
        indentationSize: 4,
        prettify: true
      }
    }
    this.config = formatOptions
  }

  /**
   * Sets the document text to the {@link DialogueData} object.
   */
  public async setDialogueText(newDialogueData: DialogueData): Promise<boolean> {
    // the full json file we're going to set
    const dialogueJsonText = this.formatDataToJson(newDialogueData)

    // replacing the whole file
    // good place to optimise, not doing it now
    // TODO
    const edit = new vscode.WorkspaceEdit()
    const fullRange = new vscode.Range(
      this.document.positionAt(0),
      this.document.positionAt(this.document.getText().length)
    )

    const documentUri = this.document.uri
    edit.replace(documentUri, fullRange, dialogueJsonText)

    // applying the edit is async, so we'll wait for it
    const result = await vscode.workspace.applyEdit(edit)
    return result
  }


  private formatDataToJson(data: DialogueData): string {
    let outputText: string
    if (this.config.prettify === false) {
      outputText = JSON.stringify(data)
    } else {
      outputText = JSON.stringify(data, null, this.config.indentationSize)
    }
    return outputText
  }

}

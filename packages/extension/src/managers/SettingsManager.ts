// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import * as vscode from 'vscode';
import { EXTENSION_NAME } from '../constants';

class SettingsManager {

  private extensionConfig = vscode.workspace.getConfiguration(EXTENSION_NAME)

  /**
   * Indentation size setting.
   */
  public getTabSize() {
    return vscode.workspace.getConfiguration("editor").get<number>("tabSize")
  }

  public getAutoOpen() {
    return this.extensionConfig.get("autoOpen")
  }

  // public setAutoOpen(setting: boolean) {
  //   this.extensionConfig.update("autoOpen", setting)
  // }

}

// vscode.workspace.getConfiguration(EXTENSION_NAME)

const settingsManager = new SettingsManager()
export default settingsManager

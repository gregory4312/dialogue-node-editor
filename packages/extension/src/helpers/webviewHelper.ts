// Copyright (c) 2025 Aevarkan
// Licensed under the GPLv3 license

import { env, Uri, Webview } from 'vscode'
import { SCRIPT_MEDIA_FILE_PATH, STYLE_MEDIA_FILE_PATH } from '../constants'
import { getNonce } from './utils'

/**
 * Generates HTML content for the webview.
 * @param webview The specific webview instance to generate content for.
 * @param extensionUri Base path of the extension.
 */
export function getWebviewContent(webview: Webview, extensionUri: Uri) {
  const scriptFilePath = Uri.joinPath(extensionUri, "media", SCRIPT_MEDIA_FILE_PATH)
  const styleFilePath = Uri.joinPath(extensionUri, "media", STYLE_MEDIA_FILE_PATH)

  const scriptFileWebviewUri = webview.asWebviewUri(scriptFilePath)
  const styleFileWebviewUri = webview.asWebviewUri(styleFilePath)

  const nonce = getNonce()

  return `<!DOCTYPE html>
  <html lang="${env.language}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy"
        content="default-src 'none';
        style-src ${webview.cspSource};
        script-src ${webview.cspSource} 'nonce-${nonce}';"
      >
      <link rel="stylesheet" href="${styleFileWebviewUri}">
    </head>
    <body>
      <div id="app"></div>
      <script nonce="${nonce}" src="${scriptFileWebviewUri}"></script>
    </body>
  </html>`;
}

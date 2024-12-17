// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { translator } from './translators'
import { Divider } from './markdown'
import { record, translateAndRecord } from './record'

const testApiServiceAvailable = async () => {
  // test api service
  if (await translator.test()) {
    vscode.window.showInformationMessage(
      `connect to ${translator.getServiceName()} successfully !`,
    )
  } else {
    vscode.window.showErrorMessage(
      `connect to ${translator.getServiceName()} failed !`,
    )
  }
}

const init = async () => {
  vscode.languages.registerHoverProvider('*', {
    async provideHover(document, position) {
      if (
        !document.getWordRangeAtPosition(position) ||
        !vscode.window.activeTextEditor
      ) {
        return
      }

      // 取hover word ，有hover word内的部分选取时优先使用选取值
      let word = document.getText(document.getWordRangeAtPosition(position))
      let selectText = vscode.window.activeTextEditor.document.getText(
        vscode.window.activeTextEditor.selection,
      )
      if (selectText && word.indexOf(selectText) > -1) {
        word = selectText
      }

      const translatedWord = await translator.translate(word)
      const serviceInfo = `Translated by : ${translator.getServiceName()}`
      const apply = `[写入](command:translator.record)`

      let hoverText = new vscode.MarkdownString(
        `${word} => ${translatedWord}${Divider}${serviceInfo}${Divider}${apply}`,
      )

      hoverText.isTrusted = true

      return new vscode.Hover(hoverText)
    },
  })
}

const applyUserConfig = () => {
  const targetLanguage = vscode.workspace
    .getConfiguration('translator')
    .get<string>('targetLanguage')
  targetLanguage && translator.setTarget(targetLanguage)
}

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('translator.record', record),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'translator.translateAndRecord',
      translateAndRecord,
    ),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'translator.testApiServiceAvailable',
      testApiServiceAvailable,
    ),
  )

  init()

  applyUserConfig()

  testApiServiceAvailable()
}

vscode.workspace.onDidChangeConfiguration((event) => {
  if (event.affectsConfiguration('translator.targetLanguage')) {
    applyUserConfig()
  }
})

// This method is called when your extension is deactivated
export function deactivate() {}

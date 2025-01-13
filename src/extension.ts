// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

import { Divider } from './markdown'

const init = async () => {
  console.log('do init')
}

const addMemo = () => {
  vscode.window.showInformationMessage(`hello world`)
}

const applyUserConfig = () => {
  const targetLanguage = vscode.workspace
    .getConfiguration('todo-memo')
    .get<string>('targetLanguage')
}

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('todo-memo.add-memo', addMemo),
  )

  init()

  applyUserConfig()
}

vscode.workspace.onDidChangeConfiguration((event) => {
  if (event.affectsConfiguration('todo-memo.targetLanguage')) {
    applyUserConfig()
  }
})

// This method is called when your extension is deactivated
export function deactivate() {}

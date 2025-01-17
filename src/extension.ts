// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import {
  getCurrCursorLocation,
  goCurrMemoLocation,
  goLocation,
  Location,
  showMemoList,
} from './locator'
import { Memo, saveMemo } from './saver'

const init = async () => {
  console.log('do init')
}

export const hello = async () => {
  vscode.window.showInformationMessage(`hello world`)
}

let currMemoLocation: Location | undefined

const addMemo = async () => {
  const memoMsg = await vscode.window.showInputBox({
    // 这个对象中所有参数都是可选参数
    password: false, // 输入内容是否是密码
    ignoreFocusOut: true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
    placeHolder: 'memo', // 在输入框内的提示信息
    prompt: 'Input your memo info', // 在输入框下方的提示信息
    validateInput: function (text) {
      if (text.length > 10) {
        return 'Too long'
      }
      if (text.length === 0) {
        return 'input memo'
      }
      return null
    }, // 对输入内容进行验证并返回
  })

  if (!memoMsg) {
    throw Error('can not get memo message')
  }

  const location = getCurrCursorLocation()

  saveMemo(new Memo(memoMsg, 'expiredTime', location))

  vscode.window.showInformationMessage(`[跳转](command:todo-memo.go-memo)`)
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

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'todo-memo.go-curr-memo',
      goCurrMemoLocation,
    ),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('todo-memo.show-memo-list', showMemoList),
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

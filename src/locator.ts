import * as vscode from 'vscode'
import { hello } from './extension'
import { getMemoList, Memo } from './saver'

export class Location {
  filePath: string
  line?: number
  character?: number

  constructor(filePath: string, line?: number, character?: number) {
    this.filePath = filePath
    this.line = line
    this.character = character
  }

  public toString = () => {
    return JSON.stringify(this)
  }
}

/**
 * 获取当前光标所在文件位置
 */
export const getCurrCursorLocation = (): Location | undefined => {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    return undefined
  }
  const cursorPosition = editor.selection.active
  const line = cursorPosition.line
  const character = cursorPosition.character

  // 获取文件路径
  const filePath = editor.document.uri.fsPath
  return new Location(filePath, line, character)
}

export const showMemoList = async () => {
  const memo = await vscode.window.showQuickPick(
    getMemoList().map((memo) => ({
      label: `${memo.time}`,
      description: memo.content,
      detail: memo?.location ? `in file ${memo.location.filePath}` : undefined,
      ...memo,
    })) as (vscode.QuickPickItem & Memo)[],
  )

  if (memo?.location) {
    goLocation(memo?.location)
  }
}

export const goLocation = async (location: Location) => {
  const { filePath, line, character } = location
  // 执行命令打开文件并定位光标
  vscode.commands.executeCommand('vscode.open', vscode.Uri.file(filePath), {
    selection:
      line && character
        ? new vscode.Range(
            new vscode.Position(line, character),
            new vscode.Position(line, character),
          )
        : undefined,
  })
}

export const goCurrMemoLocation = () => {
  hello()
}

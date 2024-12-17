import * as vscode from 'vscode'
import { BaseTransInfo, translator } from './translators'
import { TranslateCell } from './translators/translator'

const CONFIG_FILE_NAME = 'i18n.json'

const attachFilePath = () => {
  // 获取当前工作区的根目录
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]

  if (!workspaceFolder) throw new Error('请打开一个项目文件夹!')

  // 定义要创建/修改的文件路径
  return vscode.Uri.joinPath(workspaceFolder.uri, CONFIG_FILE_NAME)
}

/**
 * 打开配置文件，没有的话自动创建
 * @returns
 */
const attachRecordFile = async (): Promise<TranslateCell<BaseTransInfo>[]> => {
  const filePath = attachFilePath()

  try {
    // 读取文件内容
    let fileData
    try {
      fileData = await vscode.workspace.fs.readFile(filePath)
    } catch (error) {
      return []
    }

    // 将 Uint8Array 转换为字符串
    const fileContent = Buffer.from(fileData).toString('utf8')
    let jsonObject: TranslateCell<BaseTransInfo>[]
    try {
      // 将字符串解析为 JSON 对象
      jsonObject = JSON.parse(fileContent)
    } catch (error) {
      jsonObject = []
    }

    return jsonObject || []
  } catch (error) {
    throw new Error(`获取配置文件失败: ${(error as any).message}`)
  }
}

const updateRecordFile = async (cellList: TranslateCell<BaseTransInfo>[]) => {
  const filePath = attachFilePath()

  // 将修改后的对象转换为字符串
  const updatedContent = JSON.stringify(cellList, null, 2) // 使用缩进格式化输出

  // 将字符串转换为 Uint8Array
  const updatedContentUint8Array = new TextEncoder().encode(updatedContent)

  // 写入文件（覆盖原文件）
  await vscode.workspace.fs.writeFile(filePath, updatedContentUint8Array)

  vscode.window.showInformationMessage(`更新记录成功: ${filePath.fsPath}`)
}

/**
 * 记录
 */
export const record = async () => {
  try {
    const lastTranslateCell = translator.getLastTranslateCell()

    if (!lastTranslateCell) return

    const prevList = await attachRecordFile()

    updateRecordFile([
      ...prevList.filter((cell) => cell.text !== lastTranslateCell.text),
      lastTranslateCell,
    ])
  } catch (error) {
    vscode.window.showErrorMessage(`更新记录失败: ${(error as any).message}`)
  }
}

/**
 * 翻译当前选择文本并记录
 * @param str
 */
export const translateAndRecord = async () => {
  const selectText = vscode.window.activeTextEditor?.document.getText(
    vscode.window.activeTextEditor.selection,
  )

  if (!selectText) {
    vscode.window.showInformationMessage(`请选择一个字符串`)
    return
  }

  const cell = await translator.translate(selectText)

  vscode.window.showInformationMessage(`写入：${selectText} => ${cell}`)

  record()
}

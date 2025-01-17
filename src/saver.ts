import * as vscode from 'vscode'
import { Location } from './locator'

export class Memo {
  location?: Location
  content: string
  time: string

  constructor(content: string, time: string, location?: Location) {
    this.content = content
    this.time = time
    this.location = location
  }
}

export const memoStore: Memo[] = []

export const getMemoList = (): Memo[] => {
  return memoStore
}

export const saveMemo = (memo: Memo) => {
  memoStore.push(memo)
}

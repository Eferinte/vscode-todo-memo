import { GoogleTranslator } from './google'
import { TranslateCell, Translator } from './translator'

export interface BaseTransInfo {
  text: string
  from: string
  target: string
  translatedText: string
}

export const translator: Translator<BaseTransInfo> = new GoogleTranslator()

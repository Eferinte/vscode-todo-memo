import { BaseTransInfo } from '.'
import { TranslateCell, Translator } from './translator'

export interface Translation {
  translatedText: string
  detectedSourceLanguage: string
}

export interface GoogleTranslateRes {
  translations: Translation[]
}

export class GoogleTranslator extends Translator<BaseTransInfo> {
  private static BASE_URL =
    'https://translation.googleapis.com/language/translate/v2'
  private static API_KEY = 'AIzaSyDBw95a4XRBwIDirAgKx_K2COuSnQB7kjw'

  private static SERVICE_NAME = 'GoogleTranslate V2'

  private buildFetch(str: string) {
    const query = new URLSearchParams()
    query.append('q', str) // text
    query.append('key', GoogleTranslator.API_KEY) // apiKey
    query.append('target', this.target) // target language
    return `${GoogleTranslator.BASE_URL}?${query.toString()}`
  }

  async translate(str: string): Promise<string> {
    // 优先使用缓存
    let cell: TranslateCell<BaseTransInfo> | undefined = this.cache.get(str)

    if (!cell) {
      const res = await fetch(this.buildFetch(str))
      if (!res.ok) {
        throw new Error(`Google Translation failed: ${res.statusText}`)
      }
      const pkg = ((await res.json()) as { data: GoogleTranslateRes }).data

      cell = {
        key: str,
        text: str,
        target: this.target,
        from: pkg.translations[0].detectedSourceLanguage,
        translatedText: pkg.translations[0].translatedText,
      }
    }

    this.setLastTranslateCell(cell)

    return cell.translatedText
  }

  constructor(target: string = 'en') {
    super(GoogleTranslator.SERVICE_NAME, target)
  }
}

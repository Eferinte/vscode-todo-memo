export type TranslateCell<T> = T & {
  key: string
}

export abstract class Translator<T> {
  protected target: string

  protected cache: Map<string, TranslateCell<T>> = new Map()

  protected serviceName?: string

  protected lastTranslateCell?: TranslateCell<T>

  constructor(serviceName?: string, target: string = 'en') {
    this.target = target
    this.serviceName = serviceName
  }

  setTarget = (target: string): Translator<T> => {
    this.target = target
    return this
  }

  setLastTranslateCell(translateCell: TranslateCell<T>) {
    this.lastTranslateCell = translateCell
    return this
  }

  abstract translate(str: string): Promise<string>

  async test(): Promise<boolean> {
    const res = await this.translate('hello world')
    return !!res
  }

  getServiceName = () => this.serviceName
  getLastTranslateCell = () => this.lastTranslateCell
  updateCache = (cell: TranslateCell<T>) => {
    this.cache.set(cell.key, cell)
  }
}

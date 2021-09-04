import { IUiid } from '@/domain/uuid/uuid-protocol'
import { randomAlphanumeric } from '../random-alphanumeric/random-alphanumeric'

export class Uiid implements IUiid {
  generate (): string {
    const id: Partial<string[]> = []
    for (let i = 0; i < 24; i++) {
      id.push(randomAlphanumeric())
    }

    return id.join('')
  }
}

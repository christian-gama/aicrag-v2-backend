import { IUiid } from '@/domain/uuid/uuid-protocol'
import { randomAlphanumeric } from '../random-alphanumeric/random-alphanumeric'

export class Uiid implements IUiid {
  generate (): string {
    const id: Partial<string[]> = []
    for (let i = 0; i < 18; i++) {
      id.push(randomAlphanumeric())
    }

    const nowToString = Date.now().toString()

    return id.join('') + nowToString.slice(6, -1)
  }
}

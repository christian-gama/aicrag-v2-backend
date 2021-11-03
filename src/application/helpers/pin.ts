import { IPin } from '@/domain/helpers'
import { randomAlphanumeric } from '.'

export class Pin implements IPin {
  generate (): string {
    const pin: Partial<string[]> = []

    for (let i = 0; i < 5; i++) {
      pin.push(randomAlphanumeric())
    }

    const result = pin.join('')

    return result
  }
}

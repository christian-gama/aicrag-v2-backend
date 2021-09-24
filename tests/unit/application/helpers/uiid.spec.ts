import { UuidProtocol } from '@/application/protocols/helpers'
import { Uuid } from '@/application/usecases/helpers'

import { config } from '@/tests/config'

interface SutTypes {
  sut: UuidProtocol
}

const makeSut = (): SutTypes => {
  const sut = new Uuid()

  return { sut }
}

describe('Uiid', () => {
  it('Should return an uiid with 24 digits', () => {
    const { sut } = makeSut()

    const value = sut.generate()

    expect(value.length).toBe(36)
  })

  it('Should return a string', () => {
    const { sut } = makeSut()

    const value = sut.generate()

    expect(typeof value).toBe('string')
  })

  it('Should return an unique id', () => {
    const { sut } = makeSut()

    const values: Partial<string[]> = []
    for (let i = 0; i < config.loopTimes; i++) {
      const value = sut.generate()

      values.push(value)
    }

    const filteredValues = [...new Set(values)]

    expect(filteredValues.length).toBe(config.loopTimes)
  })
})

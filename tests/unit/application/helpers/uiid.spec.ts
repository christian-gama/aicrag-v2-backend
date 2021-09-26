import { UuidProtocol } from '@/application/protocols/helpers'
import { Uuid } from '@/application/usecases/helpers'

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
    for (let i = 0; i < 5; i++) {
      const value = sut.generate()

      values.push(value)
    }

    const filteredValues = [...new Set(values)]

    expect(filteredValues.length).toBe(5)
  })
})

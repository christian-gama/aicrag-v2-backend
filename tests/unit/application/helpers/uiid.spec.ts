import { UuidProtocol } from '@/application/protocols/helpers'
import { Uuid } from '@/application/usecases/helpers'

interface SutTypes {
  sut: UuidProtocol
}

const makeSut = (): SutTypes => {
  const sut = new Uuid()

  return { sut }
}

describe('uiid', () => {
  it('should return an uiid with 24 digits', () => {
    expect.hasAssertions()

    const { sut } = makeSut()

    const value = sut.generate()

    expect(value).toHaveLength(36)
  })

  it('should return a string', () => {
    expect.hasAssertions()

    const { sut } = makeSut()

    const value = sut.generate()

    expect(typeof value).toBe('string')
  })

  it('should return an unique id', () => {
    expect.hasAssertions()

    const { sut } = makeSut()

    const values: Partial<string[]> = []
    for (let i = 0; i < 5; i++) {
      const value = sut.generate()

      values.push(value)
    }

    const filteredValues = [...new Set(values)]

    expect(filteredValues).toHaveLength(5)
  })
})

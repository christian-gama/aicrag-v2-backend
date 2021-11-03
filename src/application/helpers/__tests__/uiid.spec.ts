import { IUuid } from '@/domain/helpers'
import { Uuid } from '@/application/helpers'

interface SutTypes {
  sut: IUuid
}

const makeSut = (): SutTypes => {
  const sut = new Uuid()

  return { sut }
}

describe('uiid', () => {
  it('should return an uiid with 24 digits', () => {
    const { sut } = makeSut()

    const result = sut.generate()

    expect(result).toHaveLength(36)
  })

  it('should return a string', () => {
    const { sut } = makeSut()

    const result = sut.generate()

    expect(typeof result).toBe('string')
  })

  it('should return an unique id', () => {
    const { sut } = makeSut()

    const values: Partial<string[]> = []
    for (let i = 0; i < 5; i++) {
      const value = sut.generate()

      values.push(value)
    }

    const result = [...new Set(values)]

    expect(result).toHaveLength(5)
  })
})

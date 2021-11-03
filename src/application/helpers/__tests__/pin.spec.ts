import { IPin } from '@/domain/helpers'
import { Pin } from '@/application/helpers'

interface SutTypes {
  sut: IPin
}

const makeSut = (): SutTypes => {
  const sut = new Pin()

  return { sut }
}

describe('pin', () => {
  it('should return 5 digits', () => {
    const { sut } = makeSut()

    const result = sut.generate()

    expect(result).toHaveLength(5)
  })

  it('should return random digits', () => {
    const { sut } = makeSut()

    const values: Partial<string[]> = []
    for (let i = 0; i < 3; i++) {
      const value = sut.generate()
      values.push(value)
    }

    const result = [...new Set(values)]

    expect(result).toHaveLength(3)
  })

  it('should return a string', () => {
    const { sut } = makeSut()

    const result = typeof sut.generate()

    expect(result).toBe('string')
  })

  it('should contain only alphanumerics', () => {
    const { sut } = makeSut()

    const result = sut.generate().match(/[a-zA-Z0-9]{5}/g)

    expect(result).toBeTruthy()
  })
})

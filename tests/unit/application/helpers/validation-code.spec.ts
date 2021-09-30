import { ValidationCodeProtocol } from '@/domain/helpers'

import { ValidationCode } from '@/application/helpers'

interface SutTypes {
  sut: ValidationCodeProtocol
}

const makeSut = (): SutTypes => {
  const sut = new ValidationCode()

  return { sut }
}

describe('codeGenerator', () => {
  it('should return 5 digits', () => {
    expect.hasAssertions()

    const { sut } = makeSut()

    const value = sut.generate()

    expect(value).toHaveLength(5)
  })

  it('should return random digits', () => {
    expect.hasAssertions()

    const { sut } = makeSut()

    const values: Partial<string[]> = []
    for (let i = 0; i < 3; i++) {
      const value = sut.generate()
      values.push(value)
    }

    const filteredValues = [...new Set(values)]

    expect(filteredValues).toHaveLength(3)
  })

  it('should return a string', () => {
    expect.hasAssertions()

    const { sut } = makeSut()

    const value = sut.generate()

    expect(typeof value).toBe('string')
  })

  it('should contain only alphanumerics', () => {
    expect.hasAssertions()

    const { sut } = makeSut()

    const value = sut.generate()

    expect(value.match(/[a-zA-Z0-9]{5}/g)).toBeTruthy()
  })
})

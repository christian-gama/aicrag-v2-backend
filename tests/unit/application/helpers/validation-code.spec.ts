import { ValidationCodeProtocol } from '@/application/protocols/helpers'
import { ValidationCode } from '@/application/usecases/helpers'

interface SutTypes {
  sut: ValidationCodeProtocol
}

const makeSut = (): SutTypes => {
  const sut = new ValidationCode()

  return { sut }
}

describe('CodeGenerator', () => {
  it('Should return 5 digits', () => {
    const { sut } = makeSut()

    const value = sut.generate()

    expect(value.length).toBe(5)
  })

  it('Should return random digits', () => {
    const { sut } = makeSut()

    const values: Partial<string[]> = []
    for (let i = 0; i < 3; i++) {
      const value = sut.generate()
      values.push(value)
    }

    const filteredValues = [...new Set(values)]

    expect(filteredValues.length).toBe(3)
  })

  it('Should return a string', () => {
    const { sut } = makeSut()

    const value = sut.generate()

    expect(typeof value).toBe('string')
  })

  it('Should contain only alphanumerics', () => {
    const { sut } = makeSut()

    const value = sut.generate()

    expect(value.match(/[a-zA-Z0-9]{5}/g)).toBeTruthy()
  })
})

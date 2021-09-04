import { makeSut } from './mocks/validation-code-mock'

describe('CodeGenerator', () => {
  it('Should return 5 digits', () => {
    const sut = makeSut()

    let error = 0
    for (let i = 0; i < 100; i++) {
      const value = sut.generate()

      if (value.length !== 5) error++
    }

    expect(error).toBe(0)
  })

  it('Should return random digits', () => {
    const sut = makeSut()

    const values: Partial<string[]> = []
    for (let i = 0; i < 10; i++) {
      const value = sut.generate()
      values.push(value)
    }

    const filteredValues = [...new Set(values)]

    expect(filteredValues.length).not.toBe(1)
  })

  it('Should return a string', () => {
    const sut = makeSut()

    const value = sut.generate()

    expect(typeof value).toBe('string')
  })

  it('Should contain only alphanumerics', () => {
    const sut = makeSut()

    const value = sut.generate()

    expect(value.match(/[a-zA-Z0-9]{5}/g)).toBeTruthy()
  })
})

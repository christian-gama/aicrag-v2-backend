import { makeSut } from './mocks/code-generator-mock'

describe('CodeGenerator', () => {
  it('Should return 5 random digits', () => {
    const sut = makeSut()

    let error = 0
    for (let i = 0; i < 5000; i++) {
      const value = sut.generate()

      if (value.length !== 5) error++
    }

    expect(error).toBe(0)
  })
})

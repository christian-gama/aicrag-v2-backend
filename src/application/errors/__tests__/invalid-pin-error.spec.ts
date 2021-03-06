import { InvalidPinError } from '@/application/errors'

describe('invalidCodeError', () => {
  it('should be an instance of Error', () => {
    const sut = new InvalidPinError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    const sut = new InvalidPinError()

    const result = sut.message

    expect(result).toBe('O pin é inválido')
  })
})

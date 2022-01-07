import { InvalidTokenError } from '@/application/errors'

describe('invalidTokenError', () => {
  it('should be an instance of Error', () => {
    const sut = new InvalidTokenError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    const sut = new InvalidTokenError()

    const result = sut.message

    expect(result).toBe('O token é inválido')
  })
})

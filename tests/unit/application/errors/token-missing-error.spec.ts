import { TokenMissingError } from '@/application/errors'

describe('tokenMissingError', () => {
  it('should be an instance of Error', () => {
    const sut = new TokenMissingError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    const sut = new TokenMissingError()

    const result = sut.message

    expect(result).toBe('Token is missing')
  })
})

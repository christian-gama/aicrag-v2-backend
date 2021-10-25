import { InvalidTokenError } from '@/application/errors'

describe('invalidTokenError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new InvalidTokenError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new InvalidTokenError()

    const result = sut.message

    expect(result).toBe('Token is invalid')
  })
})

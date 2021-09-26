import { TokenMissingError } from '@/application/usecases/errors'

describe('tokenMissingError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new TokenMissingError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new TokenMissingError()

    expect(sut.message).toBe('Token is missing')
  })
})

import { ExpiredTokenError } from '@/application/usecases/errors'

describe('expiredTokenError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new ExpiredTokenError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new ExpiredTokenError()

    expect(sut.message).toBe('Token is expired')
  })
})

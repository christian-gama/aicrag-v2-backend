import { ExpiredTokenError } from '@/application/errors'

describe('expiredTokenError', () => {
  it('should be an instance of Error', () => {
    const sut = new ExpiredTokenError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    const sut = new ExpiredTokenError()

    const result = sut.message

    expect(result).toBe('O token está expirado')
  })
})

import { ExpiredTokenError } from '@/application/usecases/errors'

describe('ExpiredTokenError', () => {
  it('Should be an instance of Error', () => {
    const sut = new ExpiredTokenError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('Should return a message with the field name', () => {
    const sut = new ExpiredTokenError()

    expect(sut.message).toBe('Token is expired')
  })
})

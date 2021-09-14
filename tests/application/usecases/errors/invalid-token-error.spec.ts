import { InvalidTokenError } from '@/application/usecases/errors'

describe('InvalidTokenError', () => {
  it('Should be an instance of Error', () => {
    const sut = new InvalidTokenError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('Should return a message with the field name', () => {
    const sut = new InvalidTokenError()

    expect(sut.message).toBe('Token is invalid or expired')
  })
})

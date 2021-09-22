import { TokenMissingError } from '@/application/usecases/errors'

describe('TokenMissingError', () => {
  it('Should be an instance of Error', () => {
    const sut = new TokenMissingError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('Should return a message with the field name', () => {
    const sut = new TokenMissingError()

    expect(sut.message).toBe('Token is missing')
  })
})

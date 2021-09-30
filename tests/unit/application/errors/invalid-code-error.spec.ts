import { InvalidCodeError } from '@/application/errors'

describe('invalidCodeError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new InvalidCodeError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new InvalidCodeError()

    expect(sut.message).toBe('Invalid code')
  })
})

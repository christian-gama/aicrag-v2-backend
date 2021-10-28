import { InvalidPinError } from '@/application/errors'

describe('invalidCodeError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new InvalidPinError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new InvalidPinError()

    const result = sut.message

    expect(result).toBe('Invalid pin')
  })
})

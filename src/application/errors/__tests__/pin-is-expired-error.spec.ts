import { PinIsExpiredError } from '@/application/errors'

describe('codeIsExpiredError', () => {
  it('should be an instance of Error', () => {
    const sut = new PinIsExpiredError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    const sut = new PinIsExpiredError()

    const result = sut.message

    expect(result).toBe('O pin expirou')
  })
})

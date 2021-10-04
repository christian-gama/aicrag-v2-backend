import { InvalidTypeError } from '@/application/errors'

describe('invalidTypeError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new InvalidTypeError('any_field')

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new InvalidTypeError('any_field')

    expect(sut.message).toBe('Invalid type: any_field')
  })
})

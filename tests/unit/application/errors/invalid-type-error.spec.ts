import { InvalidTypeError } from '@/application/errors'

describe('invalidTypeError', () => {
  it('should be an instance of Error', () => {
    const sut = new InvalidTypeError('any_field')

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    const sut = new InvalidTypeError('any_field')

    const result = sut.message

    expect(result).toBe('Invalid type: any_field')
  })
})

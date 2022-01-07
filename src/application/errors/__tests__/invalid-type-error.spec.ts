import { InvalidTypeError } from '@/application/errors'

describe('invalidTypeError', () => {
  it('should be an instance of Error', () => {
    const sut = new InvalidTypeError('any_field', 'string', 'number')

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    const sut = new InvalidTypeError('any_field', 'string', 'number')

    const result = sut.message

    expect(result).toBe('O campo any_field esperava string, mas recebeu number')
  })
})

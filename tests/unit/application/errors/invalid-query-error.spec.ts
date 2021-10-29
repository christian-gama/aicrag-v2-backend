import { InvalidQueryError } from '@/application/errors'

describe('invalidQueryError', () => {
  it('should be an instance of Error', () => {
    const sut = new InvalidQueryError('any_field')

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    const sut = new InvalidQueryError('any_field')

    const result = sut.message

    expect(result).toBe('Invalid query: any_field')
  })
})

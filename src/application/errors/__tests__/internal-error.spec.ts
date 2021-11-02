import { InternalError } from '@/application/errors'

describe('internalError', () => {
  it('should be an instance of Error', () => {
    const sut = new InternalError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    const sut = new InternalError()

    const result = sut.message

    expect(result).toBe('Internal error: Try again later')
  })
})

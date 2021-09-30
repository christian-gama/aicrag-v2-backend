import { InternalError } from '@/application/errors'

describe('internalError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new InternalError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new InternalError()

    expect(sut.message).toBe('Internal error: Try again later')
  })
})

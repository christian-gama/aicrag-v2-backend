import { MustLoginError } from '@/application/errors'

describe('mustLoginError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new MustLoginError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new MustLoginError()

    const result = sut.message

    expect(result).toBe('You must login first')
  })
})

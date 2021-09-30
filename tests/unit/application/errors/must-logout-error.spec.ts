import { MustLogoutError } from '@/application/errors'

describe('mustLogoutError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new MustLogoutError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new MustLogoutError()

    expect(sut.message).toBe('You must logout first')
  })
})

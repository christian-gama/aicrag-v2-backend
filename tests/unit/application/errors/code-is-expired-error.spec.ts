import { CodeIsExpiredError } from '@/application/usecases/errors'

describe('codeIsExpiredError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new CodeIsExpiredError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new CodeIsExpiredError()

    expect(sut.message).toBe('Code is expired')
  })
})

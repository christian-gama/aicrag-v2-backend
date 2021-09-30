import { AccountAlreadyActivatedError } from '@/application/errors'

describe('accountAlreadyActivatedError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new AccountAlreadyActivatedError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new AccountAlreadyActivatedError()

    expect(sut.message).toBe('Account is already activated')
  })
})

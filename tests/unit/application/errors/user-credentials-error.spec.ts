import { UserCredentialError } from '@/application/errors'

describe('userCredentialError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new UserCredentialError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new UserCredentialError()

    const result = sut.message

    expect(result).toBe('Credentials are invalid')
  })
})

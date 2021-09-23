import { UserCredentialError } from '@/application/usecases/errors'

describe('UserCredentialError', () => {
  it('Should be an instance of Error', () => {
    const sut = new UserCredentialError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('Should return a message with the field name', () => {
    const sut = new UserCredentialError()

    expect(sut.message).toBe('Credentials are invalid')
  })
})

import { AccountAlreadyActivatedError } from '@/application/usecases/errors'

describe('AccountAlreadyActivatedError', () => {
  it('Should be an instance of Error', () => {
    const sut = new AccountAlreadyActivatedError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('Should return a message with the field name', () => {
    const sut = new AccountAlreadyActivatedError()

    expect(sut.message).toBe('Account is already activated')
  })
})

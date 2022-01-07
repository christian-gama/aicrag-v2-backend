import { AccountAlreadyActivatedError } from '@/application/errors'

describe('accountAlreadyActivatedError', () => {
  it('should be an instance of Error', () => {
    const sut = new AccountAlreadyActivatedError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    const sut = new AccountAlreadyActivatedError()

    const result = sut.message

    expect(result).toBe('Conta já ativada')
  })
})

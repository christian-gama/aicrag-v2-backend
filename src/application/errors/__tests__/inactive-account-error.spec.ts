import { InactiveAccountError } from '@/application/errors'

describe('inactiveAccountError', () => {
  it('should be an instance of Error', () => {
    const sut = new InactiveAccountError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    const sut = new InactiveAccountError()

    const result = sut.message

    expect(result).toBe('Account is not activated')
  })
})

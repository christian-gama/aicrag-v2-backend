import { InactiveAccountError } from '@/application/errors'

describe('inactiveAccountError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new InactiveAccountError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new InactiveAccountError()

    const result = sut.message

    expect(result).toBe('Account is not activated')
  })
})

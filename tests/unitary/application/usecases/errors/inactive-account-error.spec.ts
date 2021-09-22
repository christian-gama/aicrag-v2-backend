import { InactiveAccountError } from '@/application/usecases/errors'

describe('InactiveAccountError', () => {
  it('Should be an instance of Error', () => {
    const sut = new InactiveAccountError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('Should return a message with the field name', () => {
    const sut = new InactiveAccountError()

    expect(sut.message).toBe('Account is not activated')
  })
})

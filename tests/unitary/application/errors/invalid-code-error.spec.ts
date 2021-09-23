import { InvalidCodeError } from '@/application/usecases/errors'

describe('InvalidCodeError', () => {
  it('Should be an instance of Error', () => {
    const sut = new InvalidCodeError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('Should return a message with the field name', () => {
    const sut = new InvalidCodeError()

    expect(sut.message).toBe('Invalid code')
  })
})

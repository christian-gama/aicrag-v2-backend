import { MustLoginError } from '@/application/usecases/errors'

describe('MustLoginError', () => {
  it('Should be an instance of Error', () => {
    const sut = new MustLoginError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('Should return a message with the field name', () => {
    const sut = new MustLoginError()

    expect(sut.message).toBe('You must login first')
  })
})

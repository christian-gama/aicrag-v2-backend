import { MustLogoutError } from '@/application/usecases/errors'

describe('MustLogoutError', () => {
  it('Should be an instance of Error', () => {
    const sut = new MustLogoutError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('Should return a message with the field name', () => {
    const sut = new MustLogoutError()

    expect(sut.message).toBe('You must logout first')
  })
})

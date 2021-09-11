import { InternalError } from '@/application/usecases/errors'

describe('InternalError', () => {
  it('Should be an instance of Error', () => {
    const sut = new InternalError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('Should return a message with the field name', () => {
    const sut = new InternalError()

    expect(sut.message).toBe('Internal error: Try again later')
  })
})

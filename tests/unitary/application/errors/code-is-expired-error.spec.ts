import { CodeIsExpiredError } from '@/application/usecases/errors'

describe('CodeIsExpiredError', () => {
  it('Should be an instance of Error', () => {
    const sut = new CodeIsExpiredError()

    expect(sut).toBeInstanceOf(Error)
  })

  it('Should return a message with the field name', () => {
    const sut = new CodeIsExpiredError()

    expect(sut.message).toBe('Code is expired')
  })
})

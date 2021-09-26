import { InvalidParamError } from '@/application/usecases/errors'

describe('invalidParamError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new InvalidParamError('any_field')

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new InvalidParamError('any_field')

    expect(sut.message).toBe('Invalid param: any_field')
  })
})

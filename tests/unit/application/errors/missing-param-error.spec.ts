import { MissingParamError } from '@/application/usecases/errors'

describe('invalidParamError', () => {
  it('should be an instance of Error', () => {
    expect.hasAssertions()

    const sut = new MissingParamError('any_field')

    expect(sut).toBeInstanceOf(Error)
  })

  it('should return a message with the field name', () => {
    expect.hasAssertions()

    const sut = new MissingParamError('any_field')

    expect(sut.message).toBe('Missing param: any_field')
  })
})

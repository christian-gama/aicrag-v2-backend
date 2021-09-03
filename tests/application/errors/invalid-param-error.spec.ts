import { InvalidParamError } from '@/application/errors'

describe('InvalidParamError', () => {
  it('Should be an instance of Error', () => {
    const sut = new InvalidParamError('any_field')

    expect(sut).toBeInstanceOf(Error)
  })

  it('Should return a message with the field name', () => {
    const sut = new InvalidParamError('any_field')

    expect(sut.message).toBe('Invalid param: any_field')
  })
})

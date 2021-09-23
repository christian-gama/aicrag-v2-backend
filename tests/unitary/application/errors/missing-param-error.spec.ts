import { MissingParamError } from '@/application/usecases/errors'

describe('InvalidParamError', () => {
  it('Should be an instance of Error', () => {
    const sut = new MissingParamError('any_field')

    expect(sut).toBeInstanceOf(Error)
  })

  it('Should return a message with the field name', () => {
    const sut = new MissingParamError('any_field')

    expect(sut.message).toBe('Missing param: any_field')
  })
})

import { MissingParamError } from '@/application/usecases/errors'
import { makeSut } from './mocks/validation-composite-mock'

describe('ValidationCompose', () => {
  it('Should return an error if validate returns an error', () => {
    const { sut, validationStubs } = makeSut()
    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new MissingParamError('any_field'))
  })

  it('Should return the first error if validate fails', () => {
    const { sut, validationStubs } = makeSut()
    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('first_error'))
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('seconds_error'))

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new MissingParamError('first_error'))
  })

  it('Should return nothing if succeds', () => {
    const { sut } = makeSut()
    const value = sut.validate({ field: 'any_field' })

    expect(value).toBeFalsy()
  })
})

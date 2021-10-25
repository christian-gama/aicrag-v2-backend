import { IValidator } from '@/domain/validators'

import { MissingParamError } from '@/application/errors'
import { ValidationComposite } from '@/application/validators/user'

import { makeValidatorStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: IValidator
  validationStubs: IValidator[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidatorStub(), makeValidatorStub()]

  const sut = new ValidationComposite(validationStubs)

  return { sut, validationStubs }
}

describe('validationComposite', () => {
  it('should return an error if validate returns an error', async () => {
    expect.hasAssertions()

    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const result = await sut.validate({ field: 'any_value' })

    expect(result).toStrictEqual(new MissingParamError('any_field'))
  })

  it('should return the first error if validate fails', async () => {
    expect.hasAssertions()

    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('first_error'))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('seconds_error'))

    const error = await sut.validate({ field: 'any_value' })

    expect(error).toStrictEqual(new MissingParamError('first_error'))
  })

  it('should return nothing if succeeds', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const result = await sut.validate({ field: 'any_field' })

    expect(result).toBeFalsy()
  })
})

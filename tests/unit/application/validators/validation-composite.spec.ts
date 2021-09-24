import { ValidatorProtocol } from '@/application/protocols/validators'
import { MissingParamError } from '@/application/usecases/errors'
import { ValidationComposite } from '@/application/usecases/validators'
import { makeValidatorStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: ValidatorProtocol
  validationStubs: ValidatorProtocol[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidatorStub(), makeValidatorStub()]
  const sut = new ValidationComposite(validationStubs)

  return { sut, validationStubs }
}

describe('ValidationCompose', () => {
  it('Should return an error if validate returns an error', async () => {
    const { sut, validationStubs } = makeSut()
    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))

    const error = await sut.validate({ field: 'any_value' })

    expect(error).toEqual(new MissingParamError('any_field'))
  })

  it('Should return the first error if validate fails', async () => {
    const { sut, validationStubs } = makeSut()
    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('first_error'))
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('seconds_error'))

    const error = await sut.validate({ field: 'any_value' })

    expect(error).toEqual(new MissingParamError('first_error'))
  })

  it('Should return nothing if succeds', async () => {
    const { sut } = makeSut()
    const value = await sut.validate({ field: 'any_field' })

    expect(value).toBeFalsy()
  })
})
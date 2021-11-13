import { IValidator } from '@/domain/validators'
import { IHttpHelper } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeValidatorStub } from '@/tests/__mocks__'
import { UpdateUserController } from '../'

interface SutTypes {
  httpHelper: IHttpHelper
  sut: UpdateUserController
  validateAccountActivatedStub: IValidator
  validateEmailStub: IValidator
  validateHandicapStub: IValidator
  validateNameStub: IValidator
  validateRoleStub: IValidator
  validateTokenVersionStub: IValidator
}
const makeSut = (): SutTypes => {
  const httpHelper = makeHttpHelper()
  const validateAccountActivatedStub = makeValidatorStub()
  const validateEmailStub = makeValidatorStub()
  const validateHandicapStub = makeValidatorStub()
  const validateNameStub = makeValidatorStub()
  const validateRoleStub = makeValidatorStub()
  const validateTokenVersionStub = makeValidatorStub()

  const sut = new UpdateUserController(
    httpHelper,
    validateAccountActivatedStub,
    validateEmailStub,
    validateHandicapStub,
    validateNameStub,
    validateRoleStub,
    validateTokenVersionStub
  )

  return {
    httpHelper,
    sut,
    validateAccountActivatedStub,
    validateEmailStub,
    validateHandicapStub,
    validateNameStub,
    validateRoleStub,
    validateTokenVersionStub
  }
}

describe('updateUserController', () => {
  it('should return an error if tries to update name and name is invalid', async () => {
    const { httpHelper, sut, validateNameStub } = makeSut()
    jest.spyOn(validateNameStub, 'validate').mockReturnValueOnce(new Error())

    const result = await sut.handle({ body: { name: 'invalid_name' } })

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return an error if tries to update email and email is invalid', async () => {
    const { httpHelper, sut, validateEmailStub } = makeSut()
    jest.spyOn(validateEmailStub, 'validate').mockReturnValueOnce(new Error())

    const result = await sut.handle({ body: { email: 'invalid_email' } })

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return an error if tries to update role and role is invalid', async () => {
    const { httpHelper, sut, validateRoleStub } = makeSut()
    jest.spyOn(validateRoleStub, 'validate').mockReturnValueOnce(new Error())

    const result = await sut.handle({ body: { role: 'invalid_role' } })

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return an error if tries to update handicap and handicap is invalid', async () => {
    const { httpHelper, sut, validateHandicapStub } = makeSut()
    jest.spyOn(validateHandicapStub, 'validate').mockReturnValueOnce(new Error())

    const result = await sut.handle({ body: { handicap: 'invalid_handicap' } })

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return an error if tries to update accountActivated and accountActivated is invalid', async () => {
    const { httpHelper, sut, validateAccountActivatedStub } = makeSut()
    jest.spyOn(validateAccountActivatedStub, 'validate').mockReturnValueOnce(new Error())

    const result = await sut.handle({ body: { accountActivated: 'invalid_accountActivated' } })

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return an error if tries to update tokenVersion and tokenVersion is invalid', async () => {
    const { httpHelper, sut, validateTokenVersionStub } = makeSut()
    jest.spyOn(validateTokenVersionStub, 'validate').mockReturnValueOnce(new Error())

    const result = await sut.handle({ body: { tokenVersion: 'invalid_tokenVersion' } })

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })
})

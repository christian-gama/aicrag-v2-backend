import { IValidator } from '@/domain/validators'
import { IHttpHelper } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeValidatorStub } from '@/tests/__mocks__'
import { UpdateUserController } from '../'

interface SutTypes {
  httpHelper: IHttpHelper
  sut: UpdateUserController
  validateEmailStub: IValidator
  validateNameStub: IValidator
  validateRoleStub: IValidator
}
const makeSut = (): SutTypes => {
  const httpHelper = makeHttpHelper()
  const validateEmailStub = makeValidatorStub()
  const validateNameStub = makeValidatorStub()
  const validateRoleStub = makeValidatorStub()

  const sut = new UpdateUserController(httpHelper, validateEmailStub, validateNameStub, validateRoleStub)

  return { httpHelper, sut, validateEmailStub, validateNameStub, validateRoleStub }
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
})

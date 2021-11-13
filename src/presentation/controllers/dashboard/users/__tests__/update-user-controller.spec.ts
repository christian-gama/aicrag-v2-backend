import { IValidator } from '@/domain/validators'
import { IHttpHelper } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeValidatorStub } from '@/tests/__mocks__'
import { UpdateUserController } from '../'

interface SutTypes {
  httpHelper: IHttpHelper
  sut: UpdateUserController
  updateUserValidatorStub: IValidator
}
const makeSut = (): SutTypes => {
  const httpHelper = makeHttpHelper()
  const updateUserValidatorStub = makeValidatorStub()

  const sut = new UpdateUserController(httpHelper, updateUserValidatorStub)

  return {
    httpHelper,
    sut,
    updateUserValidatorStub
  }
}

describe('updateUserController', () => {
  it('should return an error if validation fails', async () => {
    const { httpHelper, sut, updateUserValidatorStub } = makeSut()
    jest.spyOn(updateUserValidatorStub, 'validate').mockReturnValueOnce(new Error())

    const result = await sut.handle({ body: { any_field: 'invalid_field' } })

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })
})

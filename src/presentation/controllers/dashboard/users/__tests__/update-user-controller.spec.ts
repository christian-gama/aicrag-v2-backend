import { IValidator } from '@/domain/validators'
import { IHttpHelper } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeValidatorStub } from '@/tests/__mocks__'
import { UpdateUserController } from '../'

interface SutTypes {
  httpHelper: IHttpHelper
  sut: UpdateUserController
  validateNameStub: IValidator
}
const makeSut = (): SutTypes => {
  const httpHelper = makeHttpHelper()
  const validateNameStub = makeValidatorStub()

  const sut = new UpdateUserController(httpHelper, validateNameStub)

  return { httpHelper, sut, validateNameStub }
}

describe('updateUserController', () => {
  it('should return an error if tries to update name and name is invalid', async () => {
    const { httpHelper, sut, validateNameStub } = makeSut()
    jest.spyOn(validateNameStub, 'validate').mockReturnValueOnce(new Error())

    const result = await sut.handle({ body: { name: 'invalid_name' } })

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })
})

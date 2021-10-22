import { IUser } from '@/domain'
import { UserRepositoryProtocol } from '@/domain/repositories'

import { MissingParamError } from '@/application/errors'
import { ValidatePasswordToken } from '@/application/validators/user'

import { makeFakeUser, makeUserRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: ValidatePasswordToken
  fakeUser: IUser
  userRepositoryStub: UserRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)
  fakeUser.temporary.resetPasswordToken = 'any_token'

  const sut = new ValidatePasswordToken(userRepositoryStub)

  return { fakeUser, sut, userRepositoryStub }
}

describe('validatePasswordToken', () => {
  it('should return a MissingParamError if email does not exists', async () => {
    expect.hasAssertions()

    const { sut, userRepositoryStub } = makeSut()
    const data = { email: 'invalid_email@email.com' }
    jest.spyOn(userRepositoryStub, 'findUserByEmail').mockReturnValueOnce(Promise.resolve(null))

    const error = await sut.validate(data)

    expect(error).toStrictEqual(new MissingParamError('resetPasswordToken'))
  })

  it('should call findUserByEmail with correct value', async () => {
    expect.hasAssertions()

    const { fakeUser, sut, userRepositoryStub } = makeSut()
    const data = { email: fakeUser.personal.email }
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findUserByEmail')

    await sut.validate(data)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(data.email)
  })

  it('should return a MissingParamError if resetPasswordToken does not exist', async () => {
    expect.hasAssertions()

    const { fakeUser, sut } = makeSut()
    const data = { email: fakeUser.personal.email }
    fakeUser.temporary.resetPasswordToken = null

    const result = await sut.validate(data)

    expect(result).toStrictEqual(new MissingParamError('resetPasswordToken'))
  })

  it('should return undefined if succeds', async () => {
    expect.hasAssertions()

    const { fakeUser, sut } = makeSut()
    const data = { email: fakeUser.personal.email }

    const result = await sut.validate(data)

    expect(result).toBeUndefined()
  })
})

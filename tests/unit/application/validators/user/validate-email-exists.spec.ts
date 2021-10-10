import { IUser } from '@/domain'
import { UserRepositoryProtocol } from '@/domain/repositories'

import { UserCredentialError } from '@/application/errors'
import { ValidateEmailExists } from '@/application/validators/user'

import { makeFakeUser, makeUserRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  sut: ValidateEmailExists
  userRepositoryStub: UserRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new ValidateEmailExists(userRepositoryStub)

  return { fakeUser, sut, userRepositoryStub }
}

describe('validateEmailExists', () => {
  it('should return a UserCredentialError if email does not exists', async () => {
    expect.hasAssertions()

    const { sut, userRepositoryStub } = makeSut()
    const data = { email: 'invalid_email@email.com', password: 'any_password' }
    jest
      .spyOn(userRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(null))

    const error = await sut.validate(data)

    expect(error).toStrictEqual(new UserCredentialError())
  })

  it('should call findUserByEmail with correct value', async () => {
    expect.hasAssertions()

    const { sut, userRepositoryStub } = makeSut()
    const data = { email: 'invalid_email@email.com', password: 'any_password' }
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findUserByEmail')

    await sut.validate(data)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(data.email)
  })
})

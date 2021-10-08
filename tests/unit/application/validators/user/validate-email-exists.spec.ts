import { IUser } from '@/domain'
import { UserDbRepositoryProtocol } from '@/domain/repositories'

import { UserCredentialError } from '@/application/errors'
import { ValidateEmailExists } from '@/application/validators/user'

import { makeFakeUser, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  sut: ValidateEmailExists
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new ValidateEmailExists(userDbRepositoryStub)

  return { fakeUser, sut, userDbRepositoryStub }
}

describe('validateEmailExists', () => {
  it('should return a UserCredentialError if email does not exists', async () => {
    expect.hasAssertions()

    const { sut, userDbRepositoryStub } = makeSut()
    const data = { email: 'invalid_email@email.com', password: 'any_password' }
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(null))

    const error = await sut.validate(data)

    expect(error).toStrictEqual(new UserCredentialError())
  })

  it('should call findUserByEmail with correct value', async () => {
    expect.hasAssertions()

    const { sut, userDbRepositoryStub } = makeSut()
    const data = { email: 'invalid_email@email.com', password: 'any_password' }
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.validate(data)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(data.email)
  })
})

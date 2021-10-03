import { IUser } from '@/domain'
import { UserDbRepositoryProtocol } from '@/domain/repositories'

import { UserCredentialError } from '@/application/errors'
import { ValidateTempEmail } from '@/application/validators/user'

import { makeFakeUser, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  sut: ValidateTempEmail
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new ValidateTempEmail(userDbRepositoryStub)

  return { fakeUser, sut, userDbRepositoryStub }
}

describe('validateTempEmail', () => {
  it('should return a UserCredentialError if email does not exists', async () => {
    expect.hasAssertions()

    const { sut, userDbRepositoryStub } = makeSut()
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    const error = await sut.validate(credentials)

    expect(error).toStrictEqual(new UserCredentialError())
  })

  it('should return a UserCredentialError if temporary email does not exists', async () => {
    expect.hasAssertions()

    const { fakeUser, sut } = makeSut()
    const credentials = { email: 'invalid_email@email.com' }
    fakeUser.temporary.tempEmail = null

    const error = await sut.validate(credentials)

    expect(error).toStrictEqual(new UserCredentialError())
  })

  it('should return a undefined if temporary email exist', async () => {
    expect.hasAssertions()

    const { fakeUser, sut } = makeSut()
    const credentials = { email: 'invalid_email@email.com' }
    fakeUser.temporary.tempEmail = 'any_email@mail.com'

    const response = await sut.validate(credentials)

    expect(response).toBeUndefined()
  })

  it('should call findUserByEmail with correct value', async () => {
    expect.hasAssertions()

    const { sut, userDbRepositoryStub } = makeSut()
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.validate(credentials)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(credentials.email)
  })
})

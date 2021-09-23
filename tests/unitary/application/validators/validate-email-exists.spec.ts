import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { UserCredentialError } from '@/application/usecases/errors'
import { ValidateEmailExists } from '@/application/usecases/validators'
import { IUser } from '@/domain'
import { makeFakeUser, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: ValidateEmailExists
  userDbRepositoryStub: UserDbRepositoryProtocol
  fakeUser: IUser
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)
  const sut = new ValidateEmailExists(userDbRepositoryStub)

  return { sut, userDbRepositoryStub, fakeUser }
}

describe('ValidateCredentials', () => {
  it('Should return a UserCredentialError if email does not exists', async () => {
    const { sut, userDbRepositoryStub } = makeSut()
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    const error = await sut.validate(credentials)

    expect(error).toEqual(new UserCredentialError())
  })

  it('Should call findUserByEmail with correct value', async () => {
    const { sut, userDbRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    await sut.validate(credentials)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(credentials.email)
  })
})

import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { InactiveAccountError } from '@/application/usecases/errors'
import { ValidateActiveAccount } from '@/application/usecases/validators'
import { IUser } from '@/domain'
import { makeFakeUser, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: ValidatorProtocol
  userDbRepositoryStub: UserDbRepositoryProtocol
  fakeUser: IUser
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  fakeUser.settings.accountActivated = true

  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)
  const sut = new ValidateActiveAccount(userDbRepositoryStub)

  return { sut, userDbRepositoryStub, fakeUser }
}

describe('ValidateCredentials', () => {
  it('Should return a InactiveAccountError if user account is inactive', async () => {
    const { sut, userDbRepositoryStub, fakeUser } = makeSut()
    fakeUser.settings.accountActivated = false
    jest
      .spyOn(userDbRepositoryStub, 'saveUser')
      .mockReturnValueOnce(Promise.resolve(fakeUser))

    const result = await sut.validate(fakeUser)

    expect(result).toEqual(new InactiveAccountError())
  })

  it('Should call findUserByEmail with correct value', async () => {
    const { sut, userDbRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    await sut.validate(credentials)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(credentials.email)
  })

  it('Should return nothing if succeds', async () => {
    const { sut } = makeSut()
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    const value = await sut.validate(credentials)

    expect(value).toBe(undefined)
  })
})

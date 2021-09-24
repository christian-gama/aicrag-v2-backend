import { IUser } from '@/domain'

import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { InactiveAccountError } from '@/application/usecases/errors'
import { ValidateActiveAccount } from '@/application/usecases/validators'

import { makeFakeUser, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: ValidatorProtocol
  fakeUser: IUser
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)
  fakeUser.settings.accountActivated = true

  const sut = new ValidateActiveAccount(userDbRepositoryStub)

  return { sut, fakeUser, userDbRepositoryStub }
}

describe('ValidateCredentials', () => {
  it('Should return a InactiveAccountError if user account is inactive', async () => {
    const { sut, fakeUser, userDbRepositoryStub } = makeSut()
    fakeUser.settings.accountActivated = false
    jest
      .spyOn(userDbRepositoryStub, 'saveUser')
      .mockReturnValueOnce(Promise.resolve(fakeUser))

    const result = await sut.validate(fakeUser)

    expect(result).toEqual(new InactiveAccountError())
  })

  it('Should call findUserByEmail with correct value', async () => {
    const { sut, userDbRepositoryStub } = makeSut()
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

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

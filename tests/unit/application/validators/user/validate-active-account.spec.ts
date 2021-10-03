import { IUser } from '@/domain'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { InactiveAccountError } from '@/application/errors'
import { ValidateActiveAccount } from '@/application/validators/user'

import { makeFakeUser, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  sut: ValidatorProtocol
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)
  fakeUser.settings.accountActivated = true

  const sut = new ValidateActiveAccount(userDbRepositoryStub)

  return { fakeUser, sut, userDbRepositoryStub }
}

describe('validateCredentials', () => {
  it('should return a InactiveAccountError if user account is inactive', async () => {
    expect.hasAssertions()

    const { fakeUser, sut } = makeSut()
    fakeUser.settings.accountActivated = false

    const result = await sut.validate(fakeUser)

    expect(result).toStrictEqual(new InactiveAccountError())
  })

  it('should call findUserByEmail with correct value', async () => {
    expect.hasAssertions()

    const { sut, userDbRepositoryStub } = makeSut()
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.validate(credentials)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(credentials.email)
  })

  it('should return nothing if succeeds', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    const value = await sut.validate(credentials)

    expect(value).toBeUndefined()
  })
})

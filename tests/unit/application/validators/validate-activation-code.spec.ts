import { IUser } from '@/domain'

import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { InvalidCodeError, AccountAlreadyActivatedError, CodeIsExpiredError } from '@/application/usecases/errors'
import { ValidateActivationCode } from '@/application/usecases/validators'

import { makeFakeUser, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  sut: ValidateActivationCode
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new ValidateActivationCode(userDbRepositoryStub)

  return { fakeUser, sut, userDbRepositoryStub }
}

describe('validateActivationCode', () => {
  it('should call findUserByEmail with correct email', async () => {
    expect.hasAssertions()

    const { fakeUser, sut, userDbRepositoryStub } = makeSut()
    const fakeData = { activationCode: 'any_code', email: fakeUser.personal.email }
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.validate(fakeData)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(fakeData.email)
  })

  it('should return an InvalidCodeError if activation code is not valid', async () => {
    expect.hasAssertions()

    const { fakeUser, sut } = makeSut()
    const fakeData = { activationCode: 'invalid_code', email: fakeUser.personal.email }

    const value = await sut.validate(fakeData)

    expect(value).toStrictEqual(new InvalidCodeError())
  })

  it('should return an AccountAlreadyActivated if account is already activated', async () => {
    expect.hasAssertions()

    const { fakeUser, sut } = makeSut()
    const fakeData = { activationCode: fakeUser.temporary.activationCode, email: fakeUser.personal.email }
    fakeUser.settings.accountActivated = true

    const value = await sut.validate(fakeData)

    expect(value).toStrictEqual(new AccountAlreadyActivatedError())
  })

  it('should return a CodeIsExpiredError if activation code is expired', async () => {
    expect.hasAssertions()

    const { fakeUser, sut } = makeSut()
    const expirationDate = new Date(Date.now() - 1000)
    const fakeData = {
      activationCode: fakeUser.temporary.activationCode,
      email: fakeUser.personal.email
    }
    fakeUser.settings.accountActivated = false
    fakeUser.temporary.activationCodeExpiration = expirationDate

    const value = await sut.validate(fakeData)

    expect(value).toStrictEqual(new CodeIsExpiredError())
  })

  it('should return an InvalidCodeError if there is no activationCodeExpiration', async () => {
    expect.hasAssertions()

    const { fakeUser, sut } = makeSut()
    const fakeData = { activationCode: 'any_code', email: fakeUser.personal.email }
    fakeUser.temporary.activationCodeExpiration = null

    const value = await sut.validate(fakeData)

    expect(value).toStrictEqual(new InvalidCodeError())
  })

  it('should return an InvalidCodeError if there is no user', async () => {
    expect.hasAssertions()

    const { sut, userDbRepositoryStub } = makeSut()
    const fakeData = { activationCode: 'any_code', email: 'non_existent@email.com' }
    jest.spyOn(userDbRepositoryStub, 'findUserByEmail').mockReturnValueOnce(Promise.resolve(undefined))

    const value = await sut.validate(fakeData)

    expect(value).toStrictEqual(new InvalidCodeError())
  })
})

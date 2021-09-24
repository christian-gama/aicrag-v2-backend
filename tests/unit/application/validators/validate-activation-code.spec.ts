import { IUser } from '@/domain'

import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { InvalidCodeError, AccountAlreadyActivatedError, CodeIsExpiredError } from '@/application/usecases/errors'
import { ValidateActivationCode } from '@/application/usecases/validators'

import { makeFakeUser, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: ValidateActivationCode
  userDbRepositoryStub: UserDbRepositoryProtocol
  fakeUser: IUser
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)
  const sut = new ValidateActivationCode(userDbRepositoryStub)

  return { sut, userDbRepositoryStub, fakeUser }
}

describe('ValidateActivationCode', () => {
  it('Should call findUserByEmail with correct email', async () => {
    const { sut, userDbRepositoryStub, fakeUser } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')
    const fakeData = { email: fakeUser.personal.email, activationCode: 'any_code' }

    await sut.validate(fakeData)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(fakeData.email)
  })

  it('Should return an InvalidCodeError if activation code is not valid', async () => {
    const { sut, fakeUser } = makeSut()
    const fakeData = { email: fakeUser.personal.email, activationCode: 'invalid_code' }

    const value = await sut.validate(fakeData)

    expect(value).toEqual(new InvalidCodeError())
  })

  it('Should return an AccountAlreadyActivated if account is already activated', async () => {
    const { sut, fakeUser } = makeSut()
    fakeUser.settings.accountActivated = true

    const fakeData = { email: fakeUser.personal.email, activationCode: 'any_code' }

    const value = await sut.validate(fakeData)

    expect(value).toEqual(new AccountAlreadyActivatedError())
  })

  it('Should return a CodeIsExpiredError if activation code is expired', async () => {
    const { sut, fakeUser } = makeSut()
    const expirationDate = new Date(Date.now() - 1000)
    fakeUser.settings.accountActivated = false

    if (fakeUser.temporary) fakeUser.temporary.activationCodeExpiration = expirationDate

    const fakeData = {
      email: fakeUser.personal.email,
      activationCode: fakeUser.temporary.activationCode
    }

    const value = await sut.validate(fakeData)

    expect(value).toEqual(new CodeIsExpiredError())
  })

  it('Should return an InvalidCodeError if there is no activationCodeExpiration', async () => {
    const { sut, fakeUser } = makeSut()
    fakeUser.temporary.activationCodeExpiration = null

    const fakeData = { email: fakeUser.personal.email, activationCode: 'any_code' }

    const value = await sut.validate(fakeData)

    expect(value).toEqual(new InvalidCodeError())
  })

  it('Should return an InvalidCodeError if there is no user', async () => {
    const { sut, userDbRepositoryStub } = makeSut()
    jest.spyOn(userDbRepositoryStub, 'findUserByEmail').mockReturnValueOnce(Promise.resolve(undefined))

    const fakeData = { email: 'non_existent@email.com', activationCode: 'any_code' }

    const value = await sut.validate(fakeData)

    expect(value).toEqual(new InvalidCodeError())
  })
})

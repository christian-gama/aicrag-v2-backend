import { IUser } from '@/domain'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'

import { InactiveAccountError } from '@/application/errors'
import { ValidateActiveAccount } from '@/application/validators/user'

import { makeFakeUser, makeUserRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  sut: IValidator
  userRepositoryStub: IUserRepository
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)
  fakeUser.settings.accountActivated = true

  const sut = new ValidateActiveAccount(userRepositoryStub)

  return { fakeUser, sut, userRepositoryStub }
}

describe('validatedata', () => {
  it('should return a InactiveAccountError if user account is inactive', async () => {
    expect.hasAssertions()

    const { fakeUser, sut } = makeSut()
    fakeUser.settings.accountActivated = false

    const result = await sut.validate(fakeUser)

    expect(result).toStrictEqual(new InactiveAccountError())
  })

  it('should call findByEmail with correct value', async () => {
    expect.hasAssertions()

    const { sut, userRepositoryStub } = makeSut()
    const data = { email: 'invalid_email@email.com', password: 'any_password' }
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findByEmail')

    await sut.validate(data)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(data.email)
  })

  it('should return nothing if succeeds', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const data = { email: 'invalid_email@email.com', password: 'any_password' }

    const result = await sut.validate(data)

    expect(result).toBeUndefined()
  })
})

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

describe('validateActiveAccount', () => {
  it('should return a InactiveAccountError if user account is inactive', async () => {
    const { fakeUser, sut } = makeSut()
    const data = { email: 'invalid_email@email.com' }
    fakeUser.settings.accountActivated = false

    const result = await sut.validate(data)

    expect(result).toStrictEqual(new InactiveAccountError())
  })

  it('should call findByEmail with correct value', async () => {
    const { sut, userRepositoryStub } = makeSut()
    const data = { email: 'invalid_email@email.com' }
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findByEmail')

    await sut.validate(data)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(data.email)
  })

  it('should return nothing if succeeds', async () => {
    const { sut } = makeSut()
    const data = { email: 'invalid_email@email.com' }

    const result = await sut.validate(data)

    expect(result).toBeUndefined()
  })

  it('should return undefined if param is undefined', async () => {
    const { sut } = makeSut()
    const data = {}

    const result = await sut.validate(data)

    expect(result).toBeUndefined()
  })
})

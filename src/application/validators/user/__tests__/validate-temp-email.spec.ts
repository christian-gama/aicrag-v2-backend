import { IUser } from '@/domain'
import { IUserRepository } from '@/domain/repositories'
import { UserCredentialError } from '@/application/errors'
import { ValidateTempEmail } from '@/application/validators/user'
import { makeFakeUser, makeUserRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  sut: ValidateTempEmail
  userRepositoryStub: IUserRepository
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new ValidateTempEmail(userRepositoryStub)

  return { fakeUser, sut, userRepositoryStub }
}

describe('validateTempEmail', () => {
  it('should return a UserCredentialError if email does not exists', async () => {
    const { sut, userRepositoryStub } = makeSut()
    const data = { email: 'invalid_email@email.com', password: 'any_password' }
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))

    const result = await sut.validate(data)

    expect(result).toStrictEqual(new UserCredentialError())
  })

  it('should return a UserCredentialError if temporary email does not exists', async () => {
    const { fakeUser, sut } = makeSut()
    const data = { email: 'invalid_email@email.com' }
    fakeUser.temporary.tempEmail = null

    const result = await sut.validate(data)

    expect(result).toStrictEqual(new UserCredentialError())
  })

  it('should return a undefined if temporary email exist', async () => {
    const { fakeUser, sut } = makeSut()
    const data = { email: 'invalid_email@email.com' }
    fakeUser.temporary.tempEmail = 'any_email@mail.com'

    const result = await sut.validate(data)

    expect(result).toBeUndefined()
  })

  it('should call findByEmail with correct value', async () => {
    const { sut, userRepositoryStub } = makeSut()
    const data = { email: 'invalid_email@email.com', password: 'any_password' }
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findByEmail')

    await sut.validate(data)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(data.email)
  })
})

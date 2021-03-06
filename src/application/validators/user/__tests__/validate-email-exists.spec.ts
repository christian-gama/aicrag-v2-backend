import { IUser } from '@/domain'
import { IUserRepository } from '@/domain/repositories'
import { InvalidTypeError, UserCredentialError } from '@/application/errors'
import { ValidateEmailExists } from '@/application/validators/user'
import { makeFakeUser, makeUserRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  sut: ValidateEmailExists
  userRepositoryStub: IUserRepository
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new ValidateEmailExists(userRepositoryStub)

  return { fakeUser, sut, userRepositoryStub }
}

describe('validateEmailExists', () => {
  it('should return InvalidTypeError if param has an invalid type', async () => {
    const { sut } = makeSut()
    const data = { email: 123 }

    const result = await sut.validate(data)

    expect(result).toStrictEqual(new InvalidTypeError('email', 'string', typeof data.email))
  })

  it('should return a UserCredentialError if email does not exists', async () => {
    const { sut, userRepositoryStub } = makeSut()
    const data = { email: 'invalid_email@email.com' }
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))

    const result = await sut.validate(data)

    expect(result).toStrictEqual(new UserCredentialError())
  })

  it('should call findByEmail with correct value', async () => {
    const { sut, userRepositoryStub } = makeSut()
    const data = { email: 'invalid_email@email.com' }
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findByEmail')

    await sut.validate(data)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(data.email)
  })

  it('should return undefined if succeeds', async () => {
    const { sut } = makeSut()
    const data = { email: 'valid_email@email.com' }

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

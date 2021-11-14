import { IUser } from '@/domain'
import { IComparer } from '@/domain/cryptography'
import { IUserRepository } from '@/domain/repositories'
import { InvalidTypeError, UserCredentialError } from '@/application/errors'
import { ValidatePasswordMatch } from '@/application/validators/user'
import { makeFakeUser, makeUserRepositoryStub, makeComparerStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: ValidatePasswordMatch
  comparerStub: IComparer
  fakeUser: IUser
  userRepositoryStub: IUserRepository
}

const makeSut = (): SutTypes => {
  const comparerStub = makeComparerStub()
  const fakeUser = makeFakeUser()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new ValidatePasswordMatch(comparerStub, userRepositoryStub)

  return { comparerStub, fakeUser, sut, userRepositoryStub }
}

describe('validatePasswordMatch', () => {
  it('should return InvalidTypeError if email has an invalid type', async () => {
    const { sut } = makeSut()
    const data = { email: 123, password: 'any_password' }

    const result = await sut.validate(data)

    expect(result).toStrictEqual(new InvalidTypeError('email', 'string', typeof data.email))
  })

  it('should return InvalidTypeError if password has an invalid type', async () => {
    const { sut } = makeSut()
    const data = { email: 'any_email', password: 123 }

    const result = await sut.validate(data)

    expect(result).toStrictEqual(new InvalidTypeError('password', 'string', typeof data.password))
  })

  it('should return a UserCredentialError if email does not exists', async () => {
    const { sut, userRepositoryStub } = makeSut()
    const data = { email: 'invalid_email@email.com', password: 'any_password' }
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))

    const result = await sut.validate(data)

    expect(result).toStrictEqual(new UserCredentialError())
  })

  it('should call findByEmail with correct value', async () => {
    const { sut, userRepositoryStub } = makeSut()
    const data = { email: 'invalid_email@email.com', password: 'any_password' }
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findByEmail')

    await sut.validate(data)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(data.email)
  })

  it('should return a UserCredentialError if password does not match', async () => {
    const { sut, comparerStub } = makeSut()
    const data = { email: 'invalid_email@email.com', password: 'any_password' }
    jest.spyOn(comparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))

    const result = await sut.validate(data)

    expect(result).toStrictEqual(new UserCredentialError())
  })

  it('should call compare with correct value', async () => {
    const { sut, comparerStub, fakeUser } = makeSut()
    const compareSpy = jest.spyOn(comparerStub, 'compare')
    const data = { email: 'invalid_email@email.com', password: 'any_password' }

    await sut.validate(data)

    expect(compareSpy).toHaveBeenCalledWith(data.password, fakeUser.personal.password)
  })

  it('should return undefined if param is undefined', async () => {
    const { sut } = makeSut()
    const data = {}

    const result = await sut.validate(data)

    expect(result).toBeUndefined()
  })
})

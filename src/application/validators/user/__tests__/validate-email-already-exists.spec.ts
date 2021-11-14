import { IUser } from '@/domain'
import { IUserRepository } from '@/domain/repositories'
import { ConflictParamError, InvalidTypeError } from '@/application/errors'
import { ValidateEmailAlreadyExists } from '@/application/validators/user'
import { makeFakeUser, makeUserRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  sut: ValidateEmailAlreadyExists
  userRepositoryStub: IUserRepository
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new ValidateEmailAlreadyExists(userRepositoryStub)

  return { fakeUser, sut, userRepositoryStub }
}

describe('validateEmailAlreadyExists', () => {
  it('should return InvalidTypeError if param has an invalid type', async () => {
    const { sut } = makeSut()
    const data = { email: 123 }

    const result = await sut.validate(data)

    expect(result).toStrictEqual(new InvalidTypeError('email', 'string', typeof data.email))
  })

  it('should return a ConflictParamError if email exists', async () => {
    const { sut } = makeSut()
    const data = { email: 'invalid_email@email.com' }

    const result = await sut.validate(data)

    expect(result).toStrictEqual(new ConflictParamError('email'))
  })

  it('should call findByEmail with correct value', async () => {
    const { sut, userRepositoryStub } = makeSut()
    const data = { email: 'invalid_email@email.com' }
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findByEmail')

    await sut.validate(data)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(data.email)
  })

  it('should return undefined if succeeds', async () => {
    const { sut, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))
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

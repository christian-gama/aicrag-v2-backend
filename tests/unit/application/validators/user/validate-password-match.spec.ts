import { IUser } from '@/domain'
import { ComparerProtocol } from '@/domain/cryptography'
import { UserRepositoryProtocol } from '@/domain/repositories'

import { UserCredentialError } from '@/application/errors'
import { ValidatePasswordMatch } from '@/application/validators/user'

import { makeFakeUser, makeUserRepositoryStub, makeComparerStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: ValidatePasswordMatch
  comparerStub: ComparerProtocol
  fakeUser: IUser
  userRepositoryStub: UserRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const comparerStub = makeComparerStub()
  const fakeUser = makeFakeUser()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new ValidatePasswordMatch(comparerStub, userRepositoryStub)

  return { comparerStub, fakeUser, sut, userRepositoryStub }
}

describe('validatePasswordMatch', () => {
  it('should return a UserCredentialError if email does not exists', async () => {
    expect.hasAssertions()

    const { sut, userRepositoryStub } = makeSut()
    const data = { email: 'invalid_email@email.com', password: 'any_password' }
    jest
      .spyOn(userRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(null))

    const error = await sut.validate(data)

    expect(error).toStrictEqual(new UserCredentialError())
  })

  it('should call findUserByEmail with correct value', async () => {
    expect.hasAssertions()

    const { sut, userRepositoryStub } = makeSut()
    const data = { email: 'invalid_email@email.com', password: 'any_password' }
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findUserByEmail')

    await sut.validate(data)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(data.email)
  })

  it('should return a UserCredentialError if password does not match', async () => {
    expect.hasAssertions()

    const { sut, comparerStub } = makeSut()
    const data = { email: 'invalid_email@email.com', password: 'any_password' }
    jest.spyOn(comparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))

    const result = await sut.validate(data)

    expect(result).toStrictEqual(new UserCredentialError())
  })

  it('should call compare with correct value', async () => {
    expect.hasAssertions()

    const { sut, comparerStub, fakeUser } = makeSut()
    const compareSpy = jest.spyOn(comparerStub, 'compare')
    const data = { email: 'invalid_email@email.com', password: 'any_password' }

    await sut.validate(data)

    expect(compareSpy).toHaveBeenCalledWith(data.password, fakeUser.personal.password)
  })
})

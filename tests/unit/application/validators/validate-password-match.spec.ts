import { IUser } from '@/domain'

import { ComparerProtocol } from '@/application/protocols/cryptography'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { UserCredentialError } from '@/application/usecases/errors'
import { ValidatePasswordMatch } from '@/application/usecases/validators'

import { makeFakeUser, makeUserDbRepositoryStub, makeComparerStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: ValidatePasswordMatch
  comparerStub: ComparerProtocol
  fakeUser: IUser
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const comparerStub = makeComparerStub()
  const fakeUser = makeFakeUser()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new ValidatePasswordMatch(comparerStub, userDbRepositoryStub)

  return { comparerStub, fakeUser, sut, userDbRepositoryStub }
}

describe('validatePasswordMatches', () => {
  it('should return a UserCredentialError if email does not exists', async () => {
    expect.hasAssertions()

    const { sut, userDbRepositoryStub } = makeSut()
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    const error = await sut.validate(credentials)

    expect(error).toStrictEqual(new UserCredentialError())
  })

  it('should call findUserByEmail with correct value', async () => {
    expect.hasAssertions()

    const { sut, userDbRepositoryStub } = makeSut()
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.validate(credentials)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(credentials.email)
  })

  it('should return a UserCredentialError if password does not match', async () => {
    expect.hasAssertions()

    const { sut, comparerStub } = makeSut()
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }
    jest.spyOn(comparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))

    const result = await sut.validate(credentials)

    expect(result).toStrictEqual(new UserCredentialError())
  })

  it('should call compare with correct value', async () => {
    expect.hasAssertions()

    const { sut, comparerStub, fakeUser } = makeSut()
    const compareSpy = jest.spyOn(comparerStub, 'compare')
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    await sut.validate(credentials)

    expect(compareSpy).toHaveBeenCalledWith(credentials.password, fakeUser.personal.password)
  })
})

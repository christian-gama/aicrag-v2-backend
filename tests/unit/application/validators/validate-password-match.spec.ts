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

  return { sut, comparerStub, fakeUser, userDbRepositoryStub }
}

describe('ValidatePasswordMatches', () => {
  it('Should return a UserCredentialError if email does not exists', async () => {
    const { sut, userDbRepositoryStub } = makeSut()
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))

    const error = await sut.validate(credentials)

    expect(error).toEqual(new UserCredentialError())
  })

  it('Should call findUserByEmail with correct value', async () => {
    const { sut, userDbRepositoryStub } = makeSut()
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.validate(credentials)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(credentials.email)
  })

  it('Should return a UserCredentialError if password does not match', async () => {
    const { sut, comparerStub } = makeSut()
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }
    jest.spyOn(comparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))

    const result = await sut.validate(credentials)

    expect(result).toEqual(new UserCredentialError())
  })

  it('Should call compare with correct value', async () => {
    const { sut, comparerStub, fakeUser } = makeSut()
    const compareSpy = jest.spyOn(comparerStub, 'compare')
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    await sut.validate(credentials)

    expect(compareSpy).toHaveBeenCalledWith(credentials.password, fakeUser.personal.password)
  })
})

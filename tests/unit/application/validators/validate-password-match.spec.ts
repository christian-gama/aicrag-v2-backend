import { IUser } from '@/domain'

import { ComparerProtocol } from '@/application/protocols/cryptography'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { UserCredentialError } from '@/application/usecases/errors'
import { ValidatePasswordMatch } from '@/application/usecases/validators'

import { makeFakeUser, makeUserDbRepositoryStub, makeComparerStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: ValidatePasswordMatch
  userDbRepositoryStub: UserDbRepositoryProtocol
  comparerStub: ComparerProtocol
  fakeUser: IUser
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)
  const comparerStub = makeComparerStub()
  const sut = new ValidatePasswordMatch(userDbRepositoryStub, comparerStub)

  return { sut, userDbRepositoryStub, comparerStub, fakeUser }
}

describe('ValidatePasswordMatches', () => {
  it('Should return a UserCredentialError if email does not exists', async () => {
    const { sut, userDbRepositoryStub } = makeSut()
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    const error = await sut.validate(credentials)

    expect(error).toEqual(new UserCredentialError())
  })

  it('Should call findUserByEmail with correct value', async () => {
    const { sut, userDbRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    await sut.validate(credentials)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(credentials.email)
  })

  it('Should return a UserCredentialError if password does not match', async () => {
    const { sut, comparerStub } = makeSut()
    jest.spyOn(comparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

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

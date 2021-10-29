import { IUser } from '@/domain'
import { IUserRepository } from '@/domain/repositories'

import { UserCredentialError } from '@/application/errors'
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
})

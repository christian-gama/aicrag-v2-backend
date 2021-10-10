import { IUser } from '@/domain'
import { UserRepositoryProtocol } from '@/domain/repositories'

import { UserCredentialError } from '@/application/errors'
import { ValidateTempEmail } from '@/application/validators/user'

import { makeFakeUser, makeUserRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  sut: ValidateTempEmail
  userRepositoryStub: UserRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new ValidateTempEmail(userRepositoryStub)

  return { fakeUser, sut, userRepositoryStub }
}

describe('validateTempEmail', () => {
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

  it('should return a UserCredentialError if temporary email does not exists', async () => {
    expect.hasAssertions()

    const { fakeUser, sut } = makeSut()
    const data = { email: 'invalid_email@email.com' }
    fakeUser.temporary.tempEmail = null

    const error = await sut.validate(data)

    expect(error).toStrictEqual(new UserCredentialError())
  })

  it('should return a undefined if temporary email exist', async () => {
    expect.hasAssertions()

    const { fakeUser, sut } = makeSut()
    const data = { email: 'invalid_email@email.com' }
    fakeUser.temporary.tempEmail = 'any_email@mail.com'

    const response = await sut.validate(data)

    expect(response).toBeUndefined()
  })

  it('should call findUserByEmail with correct value', async () => {
    expect.hasAssertions()

    const { sut, userRepositoryStub } = makeSut()
    const data = { email: 'invalid_email@email.com', password: 'any_password' }
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findUserByEmail')

    await sut.validate(data)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(data.email)
  })
})

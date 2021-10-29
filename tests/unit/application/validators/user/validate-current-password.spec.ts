import { IUser } from '@/domain'
import { IComparer } from '@/domain/cryptography'

import { UserCredentialError } from '@/application/errors'
import { ValidateCurrentPassword } from '@/application/validators/user'

import { HttpRequest } from '@/presentation/http/protocols'

import { makeFakeUser, makeComparerStub } from '@/tests/__mocks__'

interface SutTypes {
  comparerStub: IComparer
  fakeUser: IUser
  request: HttpRequest
  sut: ValidateCurrentPassword
}

const makeSut = (): SutTypes => {
  const comparerStub = makeComparerStub()
  const fakeUser = makeFakeUser()
  const request: HttpRequest = { body: { currentPassword: 'any_password', user: fakeUser } }

  const sut = new ValidateCurrentPassword(comparerStub)

  return { comparerStub, fakeUser, request, sut }
}

describe('validateCurrentPassword', () => {
  it('should return a UserCredentialError if there is no user', async () => {
    const { request, sut } = makeSut()
    request.body.user = undefined

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new UserCredentialError())
  })

  it('should return a UserCredentialError if password does not match', async () => {
    const { comparerStub, request, sut } = makeSut()
    jest.spyOn(comparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new UserCredentialError())
  })

  it('should call compare with correct value', async () => {
    const { comparerStub, request, sut } = makeSut()
    const compareSpy = jest.spyOn(comparerStub, 'compare')

    await sut.validate(request.body)

    expect(compareSpy).toHaveBeenCalledWith(request.body.currentPassword, request.body.user.personal.password)
  })

  it('should return a undefined if passwords matches', async () => {
    const { request, sut } = makeSut()

    const result = await sut.validate(request.body)

    expect(result).toBeUndefined()
  })
})

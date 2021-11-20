import { IUser } from '@/domain'
import { IUserRepository } from '@/domain/repositories'
import { makeFakeUser, makeUserRepositoryStub } from '@/tests/__mocks__'
import { ValidateDeletePermission } from '../'
import { ForbiddenError } from 'apollo-server-errors'

interface SutTypes {
  fakeUser: IUser
  sut: ValidateDeletePermission
  userRepositoryStub: IUserRepository
}
const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new ValidateDeletePermission(userRepositoryStub)

  return { fakeUser, sut, userRepositoryStub }
}

describe('ValidateDeletePermission', () => {
  it('should return undefined if there is no id', async () => {
    const { fakeUser, sut } = makeSut()
    const data = { user: fakeUser }

    const result = await sut.validate(data)

    expect(result).toBeUndefined()
  })

  it('should return undefined if there is no user', async () => {
    const { sut } = makeSut()
    const data = { id: 'any_id' }

    const result = await sut.validate(data)

    expect(result).toBeUndefined()
  })

  it('should return ForbiddenError if tries to delete himself', async () => {
    const { fakeUser, sut, userRepositoryStub } = makeSut()
    const data = { id: 'any_id', user: fakeUser }
    jest.spyOn(userRepositoryStub, 'findById').mockReturnValueOnce(Promise.resolve(fakeUser))

    const result = await sut.validate(data)

    expect(result).toStrictEqual(new ForbiddenError('You cannot delete yourself'))
  })

  it('should return ForbiddenError if tries to delete another administrator', async () => {
    const { fakeUser, sut, userRepositoryStub } = makeSut()
    const data = { id: 'any_id', user: fakeUser }
    const fakeUser2 = makeFakeUser({ settings: { role: 4 } })

    jest.spyOn(userRepositoryStub, 'findById').mockReturnValueOnce(Promise.resolve(fakeUser2))

    const result = await sut.validate(data)

    expect(result).toStrictEqual(new ForbiddenError('You cannot delete an administrator'))
  })
})

import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
// import { makeFakeUser } from '@/tests/domain/mocks/user-mock'
import { Collection } from 'mongodb'
import { UserCredentialError } from '@/application/usecases/errors'
import { makeSut } from './mocks/validate-credentials-mock'

let accountCollection: Collection
describe('ValidateCredentials', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  it('Should return a UserCredentialError if credentials are invalid', async () => {
    const { sut, accountDbRepositoryStub } = makeSut()
    jest
      .spyOn(accountDbRepositoryStub, 'findAccountByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    const error = await sut.validate(credentials)

    expect(error).toEqual(new UserCredentialError())
  })
})

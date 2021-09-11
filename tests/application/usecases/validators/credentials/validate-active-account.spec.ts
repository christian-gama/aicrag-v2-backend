// import { makeFakeUser } from '@/tests/domain/mocks/user-mock'
import { InactiveAccountError } from '@/application/usecases/errors'
import { makeSut } from './mocks/validate-active-account-mock'

describe('ValidateCredentials', () => {
  it('Should return a InactiveAccountError if user account is inactive', async () => {
    const { sut, accountDbRepositoryStub, fakeUser } = makeSut()
    fakeUser.settings.accountActivated = false
    jest
      .spyOn(accountDbRepositoryStub, 'saveAccount')
      .mockReturnValueOnce(Promise.resolve(fakeUser))

    const result = await sut.validate(fakeUser)

    expect(result).toEqual(new InactiveAccountError())
  })
})

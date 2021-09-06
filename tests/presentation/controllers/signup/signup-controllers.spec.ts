import { fakeValidAccount } from '@/tests/domain/mocks/account-mock'
import { makeSut } from './mocks/signup-controller-mock'

describe('SignUpController', () => {
  it('Should call the saveAccount with correct values', async () => {
    const { sut, accountDbRepositoryStub } = makeSut()
    const saveAccountSpy = jest.spyOn(accountDbRepositoryStub, 'saveAccount')
    const request = { body: fakeValidAccount }

    await sut.handle(request)

    expect(saveAccountSpy).toHaveBeenCalledWith(request.body)
  })

  it('Should call validate with correct values', async () => {
    const { sut, accountValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(accountValidatorStub, 'validate')
    const request = { body: fakeValidAccount }

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })
})

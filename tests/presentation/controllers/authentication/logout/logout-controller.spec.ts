import { MustLoginError } from '@/application/usecases/errors'
import { makeSut } from './logout-controller-sut'

describe('LogoutController', () => {
  it('Should return MustLoginError if user is not logged in', async () => {
    const { sut, httpHelper, request } = makeSut()
    request.user = undefined

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.forbidden(new MustLoginError()))
  })

  it('Should call updateUser with correct values', async () => {
    const { sut, fakeUser, request, userDbRepositoryStub } = makeSut()
    const updateUser = jest.spyOn(userDbRepositoryStub, 'updateUser')

    await sut.handle(request)

    expect(updateUser).toHaveBeenCalledWith(fakeUser, { tokenVersion: fakeUser.tokenVersion })
  })
})

import { makeSut } from './forgot-password-controller-sut'

describe('Forgot Password', () => {
  it('Should call validate with correct value', async () => {
    const { sut, forgotPasswordValidatorStub, request } = makeSut()
    const validateSpy = jest.spyOn(forgotPasswordValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('Should return badRequest if validation fails', async () => {
    const { sut, forgotPasswordValidatorStub, httpHelper, request } = makeSut()
    jest
      .spyOn(forgotPasswordValidatorStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.badRequest(new Error()))
  })

  it('Should call encrypt with correct values', async () => {
    const { sut, fakeUser, generateTokenStub, request } = makeSut()
    const encryptSpy = jest.spyOn(generateTokenStub, 'generate')

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should call findUserByEmail with correct email', async () => {
    const { sut, userDbRepositoryStub, request } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('Should call updateUser with correct email', async () => {
    const { sut, fakeUser, userDbRepositoryStub, request } = makeSut()
    const updateUserSpy = jest.spyOn(userDbRepositoryStub, 'updateUser')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser, {
      'temporary.resetPasswordToken': 'any_token'
    })
  })

  it('Should call send with correct email', async () => {
    const { sut, fakeUser, forgotPasswordEmailStub, request } = makeSut()
    const sendSpy = jest.spyOn(forgotPasswordEmailStub, 'send')

    await sut.handle(request)

    expect(sendSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should call ok with correct message', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()
    const okSpy = jest.spyOn(httpHelper, 'ok')

    await sut.handle(request)

    expect(okSpy).toHaveBeenCalledWith({
      message: `Instructions to reset your password were sent to ${fakeUser.personal.email}`
    })
  })
})

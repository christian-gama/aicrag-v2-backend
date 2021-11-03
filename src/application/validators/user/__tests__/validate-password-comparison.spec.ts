import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '@/application/errors'
import { ValidatePasswordComparison } from '@/application/validators/user'
import faker from 'faker'

interface SutTypes {
  sut: IValidator
}

const makeSut = (): SutTypes => {
  const sut = new ValidatePasswordComparison()

  return { sut }
}

describe('validatePasswordComparison', () => {
  it('should return InvalidParamError if passwords are not equal', () => {
    const { sut } = makeSut()
    const data = {
      password: faker.internet.password(),
      passwordConfirmation: faker.internet.password()
    }

    const result = sut.validate(data)

    expect(result).toStrictEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('should return nothing if succeeds', () => {
    const { sut } = makeSut()
    const password = faker.internet.password()
    const data = { password: password, passwordConfirmation: password }

    const result = sut.validate(data)

    expect(result).toBeUndefined()
  })
})

import { UserRepository } from '@/application/usecases/repositories'
import { HasherProtocol } from '@/application/protocols/cryptography'
import { UuidProtocol } from '@/application/protocols/helpers'
import { ValidationCode } from '@/application/usecases/helpers/validation-code'
import { makeHasherStub } from '@/tests/__mocks__/infra/adapters/cryptography/mock-bcrypt-adapter'
import { makeUuidStub } from '@/tests/__mocks__/application/helpers/mock-uuid'
import { makeValidationCodeStub } from '@/tests/__mocks__/application/helpers/mock-validation-code'
import { UserRepositoryProtocol } from '@/application/protocols/repositories'

interface SutTypes {
  sut: UserRepositoryProtocol
  activationCodeStub: ValidationCode
  hasherStub: HasherProtocol
  uuidStub: UuidProtocol
}

export const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub()
  const activationCodeStub = makeValidationCodeStub()
  const uuidStub = makeUuidStub()
  const sut = new UserRepository(activationCodeStub, hasherStub, uuidStub)

  return { sut, activationCodeStub, hasherStub, uuidStub }
}

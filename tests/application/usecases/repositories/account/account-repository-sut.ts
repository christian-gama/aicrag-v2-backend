import {
  AccountRepositoryProtocol,
  AccountRepository
} from '@/application/usecases/repositories/account/'
import { HasherProtocol } from '@/application/protocols/cryptography/hasher-protocol'
import { UuidProtocol } from '@/application/protocols/helpers/uuid/uuid-protocol'
import { ValidationCode } from '@/application/usecases/helpers/validation-code/validation-code'
import { makeHasherStub } from '@/tests/__mocks__/infra/adapters/cryptography/mock-bcrypt-adapter'
import { makeUuidStub } from '@/tests/__mocks__/application/helpers/mock-uuid'
import { makeValidationCodeStub } from '@/tests/__mocks__/application/helpers/mock-validation-code'

interface SutTypes {
  sut: AccountRepositoryProtocol
  activationCodeStub: ValidationCode
  hasherStub: HasherProtocol
  uuidStub: UuidProtocol
}

export const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub()
  const activationCodeStub = makeValidationCodeStub()
  const uuidStub = makeUuidStub()
  const sut = new AccountRepository(activationCodeStub, hasherStub, uuidStub)

  return { sut, activationCodeStub, hasherStub, uuidStub }
}

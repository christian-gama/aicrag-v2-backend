import {
  AccountRepositoryProtocol,
  AccountRepository
} from '@/application/usecases/repositories/account/'
import { HasherProtocol } from '@/application/protocols/cryptography/hasher-protocol'
import { UuidProtocol } from '@/application/protocols/helpers/uuid/uuid-protocol'
import { ValidationCode } from '@/application/usecases/helpers/validation-code/validation-code'

const makeActivationCodeStub = (): ValidationCode => {
  class ActivationCodeStub implements ValidationCode {
    generate (): string {
      return 'a1b2e'
    }
  }

  return new ActivationCodeStub()
}

const makeHasherStub = (): HasherProtocol => {
  class HasherStub implements HasherProtocol {
    async hash (value: string): Promise<string> {
      return Promise.resolve('hashed_value')
    }
  }

  return new HasherStub()
}

const makeUuidStub = (): UuidProtocol => {
  class UuidProtocolStub implements UuidProtocol {
    generate (): string {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    }
  }

  return new UuidProtocolStub()
}

interface SutTypes {
  sut: AccountRepositoryProtocol
  activationCodeStub: ValidationCode
  hasherStub: HasherProtocol
  uuidStub: UuidProtocol
}

export const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub()
  const activationCodeStub = makeActivationCodeStub()
  const uuidStub = makeUuidStub()
  const sut = new AccountRepository(activationCodeStub, hasherStub, uuidStub)

  return { sut, activationCodeStub, hasherStub, uuidStub }
}

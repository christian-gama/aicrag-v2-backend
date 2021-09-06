import { HasherProtocol } from '@/application/protocols/cryptography/hasher-protocol'
import { IUiid } from '@/application/protocols/helpers/uuid/uuid-protocol'
import { AccountRepositoryProtocol } from '@/application/protocols/repositories/account/account-repository-protocol'
import { ValidationCode } from '@/application/usecases/helpers/validation-code/validation-code'
import { AccountRepository } from '@/application/usecases/repositories/account/account-repository'

const makeHasherStub = (): HasherProtocol => {
  class HasherStub implements HasherProtocol {
    async hash (value: string): Promise<string> {
      return Promise.resolve('hashed_value')
    }
  }

  return new HasherStub()
}

const makeValidationCodeStub = (): ValidationCode => {
  class ValidationCodeStub implements ValidationCode {
    generate (): string {
      return 'a1b2e'
    }
  }

  return new ValidationCodeStub()
}

const makeUuidStub = (): IUiid => {
  class IUiidStub implements IUiid {
    generate (): string {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    }
  }

  return new IUiidStub()
}

interface SutTypes {
  sut: AccountRepositoryProtocol
  hasherStub: HasherProtocol
  validationCodeStub: ValidationCode
  uuidStub: IUiid
}

export const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub()
  const validationCodeStub = makeValidationCodeStub()
  const uuidStub = makeUuidStub()
  const sut = new AccountRepository(hasherStub, validationCodeStub, uuidStub)

  return { sut, hasherStub, validationCodeStub, uuidStub }
}

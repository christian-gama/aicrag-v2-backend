import { AccountValidator } from '@/application/protocols/validators/account/account-validator-protocol'
import { ValidateName } from '@/application/usecases/validators/account'

export const makeSut = (): AccountValidator => {
  const sut = new ValidateName()

  return sut
}

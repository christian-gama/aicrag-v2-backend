import { ValidateName } from '@/application/validators/account'
import { AccountValidator } from '@/domain/validators/account-validator-protocol'

export const makeSut = (): AccountValidator => {
  const sut = new ValidateName()

  return sut
}

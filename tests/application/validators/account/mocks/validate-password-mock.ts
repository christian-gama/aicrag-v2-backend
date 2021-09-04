import { ValidatePassword } from '@/application/validators/account'
import { AccountValidator } from '@/domain/validators/account-validator-protocol'

export const makeSut = (): AccountValidator => {
  const sut = new ValidatePassword()

  return sut
}

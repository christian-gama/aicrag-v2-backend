import { AccountValidator } from '@/application/protocols/validators/account/account-validator-protocol'
import { ValidatePassword } from '@/application/usecases/validators/account'

export const makeSut = (): AccountValidator => {
  const sut = new ValidatePassword()

  return sut
}

import { AccountValidator } from '@/application/protocols/validators/account/account-validator-protocol'
import { ComparePasswords } from '@/application/usecases/validators/account'

export const makeSut = (): AccountValidator => {
  const sut = new ComparePasswords()

  return sut
}

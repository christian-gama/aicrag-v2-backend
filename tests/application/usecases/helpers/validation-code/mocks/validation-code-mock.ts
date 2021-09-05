import { ValidationCodeProtocol } from '@/application/protocols/helpers/validation-code/validation-code'
import { ValidationCode } from '@/application/usecases/helpers/validation-code/validation-code'

export const makeSut = (): ValidationCodeProtocol => {
  const sut = new ValidationCode()

  return sut
}

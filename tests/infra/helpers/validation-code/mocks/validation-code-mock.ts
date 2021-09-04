import { ValidationCodeProtocol } from '@/application/helpers/validation-code/validation-code'
import { ValidationCode } from '@/infra/helpers/validation-code/validation-code'

export const makeSut = (): ValidationCodeProtocol => {
  const sut = new ValidationCode()

  return sut
}

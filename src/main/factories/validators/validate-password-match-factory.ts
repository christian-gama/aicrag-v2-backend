import { ValidatePasswordMatch } from '@/application/usecases/validators'
import { makeBcryptAdapter } from '../cryptography'
import { makeUserDbRepository } from '../repositories'

export const makeValidatePasswordMatch = (): ValidatePasswordMatch => {
  const userDbRepository = makeUserDbRepository()
  const hasher = makeBcryptAdapter()

  return new ValidatePasswordMatch(userDbRepository, hasher)
}

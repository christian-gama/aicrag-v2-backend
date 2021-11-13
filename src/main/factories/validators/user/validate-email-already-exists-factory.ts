import { ValidateEmailAlreadyExists } from '@/application/validators/user'
import { makeUserRepository } from '../../repositories'

export const makeValidateEmailAlreadyExists = (): ValidateEmailAlreadyExists => {
  const userRepository = makeUserRepository()

  return new ValidateEmailAlreadyExists(userRepository)
}

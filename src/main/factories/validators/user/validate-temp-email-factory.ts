import { ValidateTempEmail } from '@/application/validators/user'
import { makeUserRepository } from '../../repositories'

export const makeValidateTempEmail = (): ValidateTempEmail => {
  const userRepository = makeUserRepository()

  return new ValidateTempEmail(userRepository)
}

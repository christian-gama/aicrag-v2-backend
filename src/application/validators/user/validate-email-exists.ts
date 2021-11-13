import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { UserCredentialError } from '../../errors'

export class ValidateEmailExists implements IValidator {
  constructor (private readonly userRepository: IUserRepository) {}

  async validate (input: Record<string, any>): Promise<UserCredentialError | undefined> {
    const { email } = input

    const user = await this.userRepository.findByEmail(email)
    if (!user) return new UserCredentialError()
  }
}

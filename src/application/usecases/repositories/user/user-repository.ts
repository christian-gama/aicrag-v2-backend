import { IUser, SignUpUserCredentials } from '@/domain/user/index'
import { UserRepositoryProtocol } from '@/application/usecases/repositories/user'
import { HasherProtocol } from '@/application/protocols/cryptography/hasher-protocol'
import { UuidProtocol } from '@/application/protocols/helpers/uuid/uuid-protocol'
import { ValidationCodeProtocol } from '@/application/protocols/helpers/validation-code/validation-code-protocol'

export class UserRepository implements UserRepositoryProtocol {
  constructor (
    private readonly activationCode: ValidationCodeProtocol,
    private readonly hasher: HasherProtocol,
    private readonly uuid: UuidProtocol
  ) {}

  async createUser (signUpUserCredentials: SignUpUserCredentials): Promise<IUser> {
    const activationCode = this.activationCode.generate()
    const dateNow = new Date(Date.now())
    const hashedPassword = await this.hasher.hash(signUpUserCredentials.password)
    const id = this.uuid.generate()

    const activationCodeExpirationMinutes = 10 * 60 * 1000

    const user: IUser = {
      personal: {
        id: id,
        name: signUpUserCredentials.name,
        email: signUpUserCredentials.email,
        password: hashedPassword
      },
      settings: { accountActivated: false, handicap: 1, currency: 'BRL' },
      logs: {
        createdAt: dateNow,
        lastLoginAt: null,
        lastSeenAt: null,
        updatedAt: null
      },
      temporary: {
        activationCode: activationCode,
        activationCodeExpiration: new Date(Date.now() + activationCodeExpirationMinutes),
        resetCode: null,
        resetCodeExpiration: null,
        temporaryEmail: null,
        temporaryEmailExpiration: null
      },
      tokenVersion: 0
    }

    return user
  }
}

import { ISignUpUserCredentials, IUser } from '@/domain'

import { HasherProtocol } from '@/application/protocols/cryptography'
import { ValidationCodeProtocol, UuidProtocol } from '@/application/protocols/helpers'
import { UserRepositoryProtocol } from '@/application/protocols/repositories'

export class UserRepository implements UserRepositoryProtocol {
  constructor (
    private readonly activationCode: ValidationCodeProtocol,
    private readonly hasher: HasherProtocol,
    private readonly uuid: UuidProtocol
  ) {}

  async createUser (signUpUserCredentials: ISignUpUserCredentials): Promise<IUser> {
    const activationCode = this.activationCode.generate()
    const activationCodeExpirationMinutes = 10 * 60 * 1000
    const dateNow = new Date(Date.now())
    const hashedPassword = await this.hasher.hash(signUpUserCredentials.password)
    const id = this.uuid.generate()

    const user: IUser = {
      logs: {
        createdAt: dateNow,
        lastLoginAt: null,
        lastSeenAt: null,
        updatedAt: null
      },
      personal: {
        email: signUpUserCredentials.email.toLowerCase(),
        id: id,
        name: signUpUserCredentials.name,
        password: hashedPassword
      },
      settings: { accountActivated: false, handicap: 1, currency: 'BRL' },
      temporary: {
        activationCode: activationCode,
        activationCodeExpiration: new Date(Date.now() + activationCodeExpirationMinutes),
        resetPasswordToken: null,
        tempEmail: null,
        tempEmailCode: null,
        tempEmailCodeExpiration: null
      },
      tokenVersion: 0
    }

    return user
  }
}

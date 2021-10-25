import { ISignUpUserData, IUser } from '@/domain'
import { IHasher } from '@/domain/cryptography'
import { IValidationCode, IUuid } from '@/domain/helpers'
import { ICreateUserRepository } from '@/domain/repositories'

export class CreateUserRepository implements ICreateUserRepository {
  constructor (
    private readonly activationCode: IValidationCode,
    private readonly hasher: IHasher,
    private readonly uuid: IUuid
  ) {}

  async createUser (signUpUserCredentials: ISignUpUserData): Promise<IUser> {
    const activationCode = this.activationCode.generate()
    const activationCodeExpirationMinutes = 10 * 60 * 1000
    const dateNow = new Date(Date.now())
    const hashedPassword = await this.hasher.hash(signUpUserCredentials.password)
    const id = this.uuid.generate()

    const result: IUser = {
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
      settings: { accountActivated: false, currency: 'BRL', handicap: 1 },
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

    return result
  }
}

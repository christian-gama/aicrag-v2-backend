import { ISignUpUserData, IUser } from '@/domain'
import { IHasher } from '@/domain/cryptography'
import { IPin, IUuid } from '@/domain/helpers'
import { ICreateUserRepository } from '@/domain/repositories'

export class CreateUserRepository implements ICreateUserRepository {
  constructor (private readonly activationPin: IPin, private readonly hasher: IHasher, private readonly uuid: IUuid) {}

  async createUser (signUpUserCredentials: ISignUpUserData): Promise<IUser> {
    const activationPin = this.activationPin.generate()
    const activationPinExpirationMinutes = 10 * 60 * 1000
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
        activationPin: activationPin,
        activationPinExpiration: new Date(Date.now() + activationPinExpirationMinutes),
        resetPasswordToken: null,
        tempEmail: null,
        tempEmailPin: null,
        tempEmailPinExpiration: null
      },
      tokenVersion: 0
    }

    return result
  }
}

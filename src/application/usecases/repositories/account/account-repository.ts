import { User, UserAccount } from '@/domain/user'
import { AccountRepositoryProtocol } from '@/application/usecases/repositories/account/'
import { HasherProtocol } from '@/application/protocols/cryptography/hasher-protocol'
import { UuidProtocol } from '@/application/protocols/helpers/uuid/uuid-protocol'
import { ValidationCodeProtocol } from '@/application/protocols/helpers/validation-code/validation-code-protocol'

export class AccountRepository implements AccountRepositoryProtocol {
  constructor (
    private readonly activationCode: ValidationCodeProtocol,
    private readonly hasher: HasherProtocol,
    private readonly uuid: UuidProtocol
  ) {}

  async createAccount (account: UserAccount): Promise<User> {
    const activationCode = this.activationCode.generate()
    const dateNow = new Date(Date.now())
    const hashedPassword = await this.hasher.hash(account.password)
    const id = this.uuid.generate()

    const user: User = {
      personal: { id: id, name: account.name, email: account.email, password: hashedPassword },
      settings: { accountActivated: false, handicap: 1, currency: 'BRL' },
      logs: {
        createdAt: dateNow,
        lastLoginAt: null,
        lastSeenAt: null,
        updatedAt: null
      },
      temporary: {
        activationCode: activationCode
      }
    }

    return user
  }
}

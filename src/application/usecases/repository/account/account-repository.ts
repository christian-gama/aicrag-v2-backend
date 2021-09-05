import { HasherProtocol } from '@/application/protocols/cryptography/hasher-protocol'
import { IUiid } from '@/application/protocols/helpers/uuid/uuid-protocol'
import { ValidationCodeProtocol } from '@/application/protocols/helpers/validation-code/validation-code'
import { AccountRepositoryProtocol } from '@/application/protocols/repositories/account/account-repository-protocol'
import { UserAccount, User } from '@/domain/user'

export class AccountRepository implements AccountRepositoryProtocol {
  constructor (
    private readonly hasher: HasherProtocol,
    private readonly activationCode: ValidationCodeProtocol,
    private readonly uuid: IUiid
  ) {}

  async saveAccount (account: UserAccount): Promise<User> {
    const hashedPassword = await this.hasher.hash(account.password)
    const activationCode = this.activationCode.generate()
    const id = this.uuid.generate()
    const dateNow = new Date(Date.now())

    const user: User = {
      personal: { id: id, name: account.name, email: account.email, password: hashedPassword },
      settings: { accountActivated: false, handicap: 1, currency: 'USD' },
      logs: {
        createdAt: dateNow,
        lastLogin: null,
        lastSeen: null,
        updatedAt: null
      },
      temporary: {
        activationCode: activationCode
      }
    }

    return user
  }
}

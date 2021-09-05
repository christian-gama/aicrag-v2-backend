import { HasherProtocol } from '@/application/protocols/cryptography/hasher-protocol'

import bcrypt from 'bcrypt'

export class BcryptAdapter implements HasherProtocol {
  constructor (private readonly salt = 12) {}

  async hash (value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt)

    return hashedValue
  }
}

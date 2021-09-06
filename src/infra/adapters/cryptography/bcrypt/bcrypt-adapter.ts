import { HasherProtocol } from '@/application/protocols/cryptography/hasher-protocol'

import bcrypt from 'bcrypt'

export class BcryptAdapter implements HasherProtocol {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}

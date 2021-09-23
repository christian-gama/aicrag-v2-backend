import { ComparerProtocol, HasherProtocol } from '@/application/protocols/cryptography'

import bcrypt from 'bcrypt'

export class BcryptAdapter implements ComparerProtocol, HasherProtocol {
  constructor (private readonly salt: number) {}

  async compare (value: string, valueToCompare: string): Promise<boolean> {
    return await bcrypt.compare(value, valueToCompare)
  }

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}

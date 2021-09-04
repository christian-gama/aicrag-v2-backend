import bcrypt from 'bcrypt'
import { Hasher } from '@/application/cryptography/hasher-protocol'

export class BcryptAdapter implements Hasher {
  constructor (private readonly salt = 12) {}

  async hash (value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt)

    return hashedValue
  }
}
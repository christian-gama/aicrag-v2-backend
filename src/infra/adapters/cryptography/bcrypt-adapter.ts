import { IComparer, IHasher } from '@/domain/cryptography'

import bcrypt from 'bcrypt'

export class BcryptAdapter implements IComparer, IHasher {
  constructor (private readonly salt: number) {}

  async compare (value: string, valueToCompare: string): Promise<boolean> {
    return await bcrypt.compare(value, valueToCompare)
  }

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}

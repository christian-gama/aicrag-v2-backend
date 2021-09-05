import { Hasher } from '@/application/protocols/cryptography/hasher-protocol'
import { BcryptAdapter } from '@/infra/adapters/cryptography/bcrypt/bcrypt-adapter'

interface SutTypes {
  sut: Hasher
  salt: number
}

export const makeSut = (): SutTypes => {
  const salt = 12
  const sut = new BcryptAdapter(salt)

  return { sut, salt }
}

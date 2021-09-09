import { BcryptAdapter } from '@/infra/adapters/cryptography/bcrypt/bcrypt-adapter'

interface SutTypes {
  sut: BcryptAdapter
  salt: number
}

export const makeSut = (): SutTypes => {
  const salt = 1
  const sut = new BcryptAdapter(salt)

  return { sut, salt }
}

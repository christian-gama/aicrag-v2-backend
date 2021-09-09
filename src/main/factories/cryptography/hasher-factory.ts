import { BcryptAdapter } from '@/infra/adapters/cryptography/bcrypt/bcrypt-adapter'

export const makeBcryptAdapter = (): BcryptAdapter => {
  const salt = 12

  return new BcryptAdapter(salt)
}

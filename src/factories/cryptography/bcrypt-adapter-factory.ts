import { BcryptAdapter } from '@/infra/adapters/cryptography'

export const makeBcryptAdapter = (): BcryptAdapter => {
  const salt = 12

  return new BcryptAdapter(salt)
}

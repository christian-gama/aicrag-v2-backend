import { JwtAdapter } from '@/infra/adapters/cryptography/jwt/jwt-adapter'

interface SutTypes {
  sut: JwtAdapter
  secret: string
}

export const makeSut = (): SutTypes => {
  const secret = 'secret'
  const sut = new JwtAdapter(secret)

  return { sut, secret }
}

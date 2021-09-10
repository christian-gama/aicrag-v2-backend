import { JwtAdapter } from '@/infra/adapters/cryptography/jwt/jwt-adapter'
import { env } from '@/main/config/env'
import jwt from 'jsonwebtoken'

interface SutTypes {
  sut: JwtAdapter
  secret: string
  expires: string
  token: string
}

export const makeSut = (): SutTypes => {
  const secret = env.JWT_SECRET
  const expires = env.JWT_EXPIRES
  const token = jwt.sign({ id: 'any_id' }, secret, { expiresIn: expires })
  const sut = new JwtAdapter(secret, expires)

  return { sut, secret, expires, token }
}

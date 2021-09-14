import { JwtAdapter } from '@/infra/adapters/cryptography/jwt/jwt-adapter'
import { env } from '@/main/config/env'

import jwt from 'jsonwebtoken'

interface SutTypes {
  sut: JwtAdapter
  expires: string
  secret: string
  token: string
}

export const makeSut = (): SutTypes => {
  const expires = env.JWT.EXPIRES
  const secret = env.JWT.SECRET
  const token = jwt.sign({ id: 'any_id' }, secret, { expiresIn: expires })
  const sut = new JwtAdapter(expires, secret)

  return { sut, expires, secret, token }
}

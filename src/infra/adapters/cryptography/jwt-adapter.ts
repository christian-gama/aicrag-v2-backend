import { DecodedProtocol, DecoderProtocol, EncrypterProtocol } from '@/domain/cryptography'

import { ExpiredTokenError, InvalidTokenError } from '@/application/errors'

import jwt from 'jsonwebtoken'
import { promisify } from 'util'

export class JwtAdapter implements EncrypterProtocol, DecoderProtocol {
  constructor (private readonly expires: string, private readonly secret: string) {}

  async decode (token: string): Promise<DecodedProtocol | InvalidTokenError | ExpiredTokenError> {
    try {
      return await promisify<string, string, DecodedProtocol>(jwt.verify)(token, this.secret)
    } catch (error) {
      if (error.name === 'TokenExpiredError') return new ExpiredTokenError()
      else return new InvalidTokenError()
    }
  }

  encrypt (subject: Record<any, string>): string {
    return jwt.sign(subject, this.secret, { expiresIn: this.expires })
  }
}

import { IDecoded, IDecoder, IEncrypter } from '@/domain/cryptography'

import { ExpiredTokenError, InvalidTokenError } from '@/application/errors'

import jwt from 'jsonwebtoken'
import { promisify } from 'util'

export class JwtAdapter implements IEncrypter, IDecoder {
  constructor (private readonly expires: string, private readonly secret: string) {}

  async decode (token: string): Promise<IDecoded | InvalidTokenError | ExpiredTokenError> {
    try {
      return await promisify<string, string, IDecoded>(jwt.verify)(token, this.secret)
    } catch (error) {
      if (error.name === 'TokenExpiredError') return new ExpiredTokenError()
      else return new InvalidTokenError()
    }
  }

  encrypt (subject: Record<any, string>): string {
    return jwt.sign(subject, this.secret, { expiresIn: this.expires })
  }
}

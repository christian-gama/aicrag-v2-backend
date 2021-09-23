import {
  DecodedProtocol,
  DecoderProtocol
  , EncrypterProtocol
} from '@/application/protocols/cryptography'

import jwt from 'jsonwebtoken'
import { promisify } from 'util'

export class JwtAdapter implements EncrypterProtocol, DecoderProtocol {
  constructor (private readonly expires: string, private readonly secret: string) {}

  async decode (token: string): Promise<DecodedProtocol> {
    return await promisify<string, string, DecodedProtocol>(jwt.verify)(token, this.secret)
  }

  encrypt (subject: Record<any, string>): string {
    return jwt.sign(subject, this.secret, { expiresIn: this.expires })
  }
}

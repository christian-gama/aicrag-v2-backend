import {
  DecodedProtocol,
  DecoderProtocol
} from '@/application/protocols/cryptography/decoder-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'

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

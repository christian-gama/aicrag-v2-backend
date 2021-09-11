import {
  DecodedIdProtocol,
  DecoderProtocol
} from '@/application/protocols/cryptography/decoder-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'

import jwt from 'jsonwebtoken'
import { promisify } from 'util'

export class JwtAdapter implements EncrypterProtocol, DecoderProtocol {
  constructor (private readonly expires: string, private readonly secret: string) {}

  encryptId (id: string): string {
    return jwt.sign({ id }, this.secret, { expiresIn: this.expires })
  }

  async decodeId (token: string): Promise<string> {
    const decoded = await promisify<string, string, DecodedIdProtocol>(jwt.verify)(
      token,
      this.secret
    )

    return decoded.id
  }
}

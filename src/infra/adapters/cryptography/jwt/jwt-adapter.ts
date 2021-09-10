import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements EncrypterProtocol {
  constructor (private readonly secret: string, private readonly expires: string) {}

  encrypt (value: string): string {
    return jwt.sign({ id: value }, this.secret, { expiresIn: this.expires })
  }
}

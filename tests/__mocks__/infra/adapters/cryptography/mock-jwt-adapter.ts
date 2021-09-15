import {
  DecodedProtocol,
  DecoderProtocol
} from '@/application/protocols/cryptography/decoder-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'

export const makeDecoderStub = (): DecoderProtocol => {
  class DecoderStub implements DecoderProtocol {
    async decode (token: string): Promise<DecodedProtocol> {
      return Promise.resolve({ id: 'any_id', value: 'any_value', iat: 'any_iat' })
    }
  }

  return new DecoderStub()
}
export const makeEncrypterStub = (): EncrypterProtocol => {
  class EncrypterStub implements EncrypterProtocol {
    encrypt (payloadName: string, id: string): string {
      return 'any_token'
    }
  }

  return new EncrypterStub()
}

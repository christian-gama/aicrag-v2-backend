import {
  DecodedProtocol,
  DecoderProtocol
} from '@/application/protocols/cryptography/decoder-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'

export const makeDecoderStub = (): DecoderProtocol => {
  class DecoderStub implements DecoderProtocol {
    async decode (token: string): Promise<DecodedProtocol> {
      return Promise.resolve({ userId: 'any_id', version: 'any_version' })
    }
  }

  return new DecoderStub()
}

export const makeEncrypterStub = (): EncrypterProtocol => {
  class EncrypterStub implements EncrypterProtocol {
    encrypt (subject: Record<any, string>): string {
      return 'any_token'
    }
  }

  return new EncrypterStub()
}

export const makeJwtAdapterStub = (): EncrypterProtocol & DecoderProtocol => {
  class JwtAdapterStub implements EncrypterProtocol, DecoderProtocol {
    encrypt (subject: Record<any, string>): string {
      return 'any_token'
    }

    async decode (token: string): Promise<DecodedProtocol> {
      return Promise.resolve({ userId: 'any_id', version: 'any_version' })
    }
  }

  return new JwtAdapterStub()
}

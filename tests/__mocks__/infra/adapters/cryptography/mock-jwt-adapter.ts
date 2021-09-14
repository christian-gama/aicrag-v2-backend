import { DecoderProtocol } from '@/application/protocols/cryptography/decoder-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'

export const makeEncrypterStub = (): EncrypterProtocol => {
  class EncrypterStub implements EncrypterProtocol {
    encryptId (id: string): string {
      return 'any_token'
    }
  }

  return new EncrypterStub()
}

export const makeDecoderStub = (): DecoderProtocol => {
  class DecoderStub implements DecoderProtocol {
    async decodeId (token: string): Promise<string> {
      return Promise.resolve('any_id')
    }
  }

  return new DecoderStub()
}

import { HasherProtocol, ComparerProtocol, DecoderProtocol, DecodedProtocol, EncrypterProtocol } from '@/application/protocols/cryptography'

export const makeComparerStub = (): ComparerProtocol => {
  class ComparerStub implements ComparerProtocol {
    async compare (value: string, valueToCompare: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new ComparerStub()
}

export const makeDecoderStub = (): DecoderProtocol => {
  class DecoderStub implements DecoderProtocol {
    async decode (token: string): Promise<DecodedProtocol> {
      return await Promise.resolve({ userId: 'any_id', version: 'any_version' })
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

export const makeHasherStub = (): HasherProtocol => {
  class HasherStub implements HasherProtocol {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hashed_value')
    }
  }

  return new HasherStub()
}

export const makeJwtAdapterStub = (): EncrypterProtocol & DecoderProtocol => {
  class JwtAdapterStub implements EncrypterProtocol, DecoderProtocol {
    async decode (token: string): Promise<DecodedProtocol> {
      return await Promise.resolve({ userId: 'any_id', version: 'any_version' })
    }

    encrypt (subject: Record<any, string>): string {
      return 'any_token'
    }
  }

  return new JwtAdapterStub()
}

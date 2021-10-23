import { IHasher, IComparer, IDecoder, IDecoded, IEncrypter } from '@/domain/cryptography'

export const makeComparerStub = (): IComparer => {
  class ComparerStub implements IComparer {
    async compare (value: string, valueToCompare: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new ComparerStub()
}

export const makeDecoderStub = (): IDecoder => {
  class DecoderStub implements IDecoder {
    async decode (token: string): Promise<IDecoded> {
      return await Promise.resolve({ userId: 'any_id', version: 'any_version' })
    }
  }

  return new DecoderStub()
}

export const makeEncrypterStub = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    encrypt (subject: Record<any, string>): string {
      return 'any_token'
    }
  }

  return new EncrypterStub()
}

export const makeHasherStub = (): IHasher => {
  class HasherStub implements IHasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hashed_value')
    }
  }

  return new HasherStub()
}

export const makeJwtAdapterStub = (): IEncrypter & IDecoder => {
  class JwtAdapterStub implements IEncrypter, IDecoder {
    async decode (token: string): Promise<IDecoded> {
      return await Promise.resolve({ userId: 'any_id', version: 'any_version' })
    }

    encrypt (subject: Record<any, string>): string {
      return 'any_token'
    }
  }

  return new JwtAdapterStub()
}

import { ComparerProtocol, HasherProtocol } from '@/application/protocols/cryptography'

export const makeHasherStub = (): HasherProtocol => {
  class HasherStub implements HasherProtocol {
    async hash (value: string): Promise<string> {
      return Promise.resolve('hashed_value')
    }
  }

  return new HasherStub()
}

export const makeComparerStub = (): ComparerProtocol => {
  class ComparerStub implements ComparerProtocol {
    async compare (value: string, valueToCompare: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }

  return new ComparerStub()
}

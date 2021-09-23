import { GenerateTokenProtocol } from '@/application/protocols/providers'

export const makeGenerateTokenStub = (): GenerateTokenProtocol => {
  class GenerateTokenStub implements GenerateTokenProtocol {
    generate (user: any): string {
      return 'any_token'
    }
  }

  return new GenerateTokenStub()
}

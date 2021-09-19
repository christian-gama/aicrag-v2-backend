import { GenerateTokenProtocol } from '@/application/protocols/providers/generate-token-protocol'

export const makeGenerateTokenStub = (): GenerateTokenProtocol => {
  class GenerateTokenStub implements GenerateTokenProtocol {
    generate (user: any): string {
      return 'any_token'
    }
  }

  return new GenerateTokenStub()
}

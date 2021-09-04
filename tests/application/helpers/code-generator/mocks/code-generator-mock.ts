import { CodeGeneratorProtocol } from '@/domain/code-generator/code-generator-protocol'
import { CodeGenerator } from '@/application/helpers/code-generator/code-generator'

export const makeSut = (): CodeGeneratorProtocol => {
  const sut = new CodeGenerator()

  return sut
}

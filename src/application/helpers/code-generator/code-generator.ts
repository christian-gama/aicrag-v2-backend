import { CodeGeneratorProtocol } from '@/domain/code-generator/code-generator-protocol'
import { randomAlphanumeric } from '../random-alphanumeric/random-alphanumeric'

export class CodeGenerator implements CodeGeneratorProtocol {
  generate (): string {
    const code: Partial<string[]> = []

    for (let i = 0; i < 5; i++) {
      code.push(randomAlphanumeric())
    }

    return code.join('')
  }
}

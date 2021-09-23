import { UuidProtocol } from '@/application/protocols/helpers'

export const makeUuidStub = (): UuidProtocol => {
  class UuidProtocolStub implements UuidProtocol {
    generate (): string {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    }
  }

  return new UuidProtocolStub()
}

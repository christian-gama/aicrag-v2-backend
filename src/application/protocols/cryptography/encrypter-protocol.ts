export interface EncrypterProtocol {
  /**
   *
   * @description Get an ID and encrypt it based on a secret key.
   * @param payloadName The payload name that contains a value.
   * @param value The value that will be encrypted.
   * @returns Return an encrypted token that contains an ID.
   */
  encrypt: (payloadName: string, value: string) => string
}

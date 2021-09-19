export interface EncrypterProtocol {
  /**
   *
   * @description Get an ID and encrypt it based on a secret key.
   * @param subject The subject the values that will be encrypted.
   * @returns Return an encrypted token that contains an ID.
   */
  encrypt: (subject: Record<any, string>) => string
}

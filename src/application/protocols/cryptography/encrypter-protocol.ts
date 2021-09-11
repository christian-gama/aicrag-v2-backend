export interface EncrypterProtocol {
  /**
   *
   * @description Get an ID and encrypt it based on a secret key.
   * @param id The first value that will be compared to the second value.
   * @returns Return an encrypted token that contains an ID.
   */
  encryptId: (id: string) => string
}

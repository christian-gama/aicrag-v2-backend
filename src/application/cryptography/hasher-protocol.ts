
export interface Hasher {
  /**
  * @param value The value to be encrypted.
  * @returns Return a promise with the encrypted value as string.
  */
  hash: (value: string) => Promise<string>
}

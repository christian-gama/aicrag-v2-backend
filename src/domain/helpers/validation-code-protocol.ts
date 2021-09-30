export interface ValidationCodeProtocol {
  /**
   * @returns Return a string with 5 random digits in the range [a-z] and [0-9].
   */
  generate: () => string
}

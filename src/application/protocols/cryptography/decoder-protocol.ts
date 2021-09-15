/**
 * @description Interface that contains an ID obtained from a decoded token.
 */
export interface DecodedProtocol {
  [key: string]: string
}

export interface DecoderProtocol {
  /**
   * @async Asynchronous method.
   * @description Get a token and verify if the signature is valid and then return the decoded ID.
   * @param token Token that will be verified and decoded.
   * @returns Return an ID if signature is valid.
   */
  decode: (token: string) => Promise<DecodedProtocol>
}

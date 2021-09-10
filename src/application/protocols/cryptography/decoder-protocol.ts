export interface DecodedIdProtocol {
  id: string
}

export interface DecoderProtocol {
  decodeId: (value: string) => Promise<string>
}

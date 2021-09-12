import { HttpHelper } from '@/presentation/http/helper/http-helper'

export const makeSut = (): HttpHelper => {
  const sut = new HttpHelper()
  return sut
}

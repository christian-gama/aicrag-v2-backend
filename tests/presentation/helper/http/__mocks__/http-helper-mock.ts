import { HttpHelper } from '@/presentation/helper/http-helper'

export const makeSut = (): HttpHelper => {
  const sut = new HttpHelper()
  return sut
}

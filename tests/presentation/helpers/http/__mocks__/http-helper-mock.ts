import { HttpHelper } from '@/presentation/helpers/http-helper'

export const makeSut = (): HttpHelper => {
  const sut = new HttpHelper()
  return sut
}

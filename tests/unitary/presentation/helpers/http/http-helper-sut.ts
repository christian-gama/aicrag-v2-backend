import { HttpHelper } from '@/presentation/helpers/http-helper'

interface SutTypes {
  sut: HttpHelper
}

export const makeSut = (): SutTypes => {
  const sut = new HttpHelper()
  return { sut }
}

import { HttpHelper } from '@/presentation/http/http-helper'

export const makeHttpHelper = (): HttpHelper => {
  return new HttpHelper()
}

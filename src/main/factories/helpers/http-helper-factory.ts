import { HttpHelper } from '@/presentation/http/helper/http-helper'

export const makeHttpHelper = (): HttpHelper => {
  return new HttpHelper()
}

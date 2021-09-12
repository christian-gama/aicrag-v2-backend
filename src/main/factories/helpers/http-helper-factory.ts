import { HttpHelper } from '@/presentation/helper/http-helper'

export const makeHttpHelper = (): HttpHelper => {
  return new HttpHelper()
}

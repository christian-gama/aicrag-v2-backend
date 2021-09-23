import { HttpHelper } from '@/presentation/helpers/http/http-helper'

export const makeHttpHelper = (): HttpHelper => {
  return new HttpHelper()
}

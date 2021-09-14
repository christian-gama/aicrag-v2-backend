import { HttpHelper } from '@/presentation/helpers/http-helper'

export const makeHttpHelper = (): HttpHelper => {
  return new HttpHelper()
}

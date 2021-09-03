import { HttpResponse } from './protocols'

export const ok = (data: any): HttpResponse => {
  return {
    statusCode: 200,
    data: data
  }
}

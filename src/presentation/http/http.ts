import { HttpResponse } from './protocols'

export const badRequest = (statusCode: number, error: Error): HttpResponse => {
  return {
    statusCode,
    data: { error }
  }
}

export const ok = (data: any): HttpResponse => {
  return {
    statusCode: 200,
    data: data
  }
}

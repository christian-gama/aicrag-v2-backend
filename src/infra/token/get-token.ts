import { HttpRequest } from '@/presentation/http/protocols'

export const getToken = {
  accessToken: (httpRequest: HttpRequest) =>
    httpRequest.headers?.['x-access-token'] ?? httpRequest.cookies?.accessToken,
  refreshToken: (httpRequest: HttpRequest) =>
    httpRequest.headers?.['x-refresh-token'] ?? httpRequest.cookies?.refreshToken
}

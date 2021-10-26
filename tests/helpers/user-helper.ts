import { IUser } from '@/domain'

import { makeGenerateAccessToken, makeGenerateRefreshToken } from '@/factories/providers/token'

type AccessToken = string
type RefreshToken = string

export const userHelper = {
  login: async (user: IUser): Promise<[AccessToken, RefreshToken]> => {
    const accessToken = makeGenerateAccessToken().generate(user)
    const refreshToken = await makeGenerateRefreshToken().generate(user)

    return [accessToken, refreshToken]
  }
}

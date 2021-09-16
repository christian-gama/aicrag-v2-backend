import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'
import { RefreshTokenDbRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-db-repository-protocol'
import { RefreshTokenRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-repository-protocol'
import { MongoHelper } from '../helper/mongo-helper'
import { UserDbFilter } from '../user/protocols/update-user-options'
export class RefreshTokenDbRepository implements RefreshTokenDbRepositoryProtocol {
  constructor (private readonly refreshTokenRepository: RefreshTokenRepositoryProtocol) {}

  async saveRefreshToken (userId: string): Promise<RefreshToken> {
    const refreshToken = await this.refreshTokenRepository.createRefreshToken(userId)

    const refreshTokenCollection = await MongoHelper.getCollection('refresh_tokens')

    const userCollection = await MongoHelper.getCollection('users')

    const userFilter: UserDbFilter = { 'personal.id': userId }
    const userUpdate: UserDbFilter = { 'temporary.refreshToken': refreshToken.id }
    await userCollection.updateOne(userFilter, { $set: userUpdate })

    const result = await refreshTokenCollection.insertOne(refreshToken)

    return (await refreshTokenCollection.findOne({ _id: result.insertedId })) as RefreshToken
  }

  async findRefreshTokenById (id: string): Promise<RefreshToken | undefined> {
    const refreshTokenCollection = await MongoHelper.getCollection('refresh_tokens')

    const refreshToken = (await refreshTokenCollection.findOne({ id })) as RefreshToken

    if (refreshToken) return refreshToken
  }

  async deleteRefreshTokenById (id: string): Promise<number> {
    const refreshTokenCollection = await MongoHelper.getCollection('refresh_tokens')

    const deleted = await refreshTokenCollection.deleteMany({ id })

    return deleted.deletedCount
  }
}

import { SignUpUserCredentials, User } from '@/domain/user'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { UserRepositoryProtocol } from '@/application/protocols/repositories/user/user-repository-protocol'
import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { UserDbFilter } from '@/infra/database/mongodb/user/protocols/update-user-options'

export class UserDbRepository implements UserDbRepositoryProtocol {
  constructor (private readonly userRepository: UserRepositoryProtocol) {}

  async saveUser (signUpUserCredentials: SignUpUserCredentials): Promise<User> {
    const userCollection = await MongoHelper.getCollection('users')
    const user = await this.userRepository.createUser(signUpUserCredentials)

    const insertedResult = await userCollection.insertOne(user)

    return (await userCollection.findOne(insertedResult.insertedId)) as User
  }

  async findUserByEmail (email: string): Promise<User | undefined> {
    const userCollection = await MongoHelper.getCollection('users')
    const filter: UserDbFilter = { 'personal.email': email }

    const user = (await userCollection.findOne(filter)) as User

    if (user) return user
  }

  async findUserById (id: string): Promise<User | undefined> {
    const userCollection = await MongoHelper.getCollection('users')

    const filter: UserDbFilter = { 'personal.id': id }
    const user = (await userCollection.findOne(filter)) as User

    if (user) return user
  }

  async updateUser (user: User, update: UserDbFilter): Promise<User | undefined> {
    const userCollection = await MongoHelper.getCollection('users')

    const filter: UserDbFilter = { 'personal.id': user.personal.id }
    await userCollection.updateOne(filter, { $set: update })

    const updatedUser = (await userCollection.findOne(filter)) as User

    if (updatedUser) return updatedUser
  }
}

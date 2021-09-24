import { ISignUpUserCredentials, IUser } from '@/domain'

import { UserDbRepositoryProtocol, UserRepositoryProtocol } from '@/application/protocols/repositories'

import { MongoHelper } from '../helper'
import { UserDbFilter } from '../protocols'

export class UserDbRepository implements UserDbRepositoryProtocol {
  constructor (private readonly userRepository: UserRepositoryProtocol) {}

  async saveUser (signUpUserCredentials: ISignUpUserCredentials): Promise<IUser> {
    const userCollection = MongoHelper.getCollection('users')
    const user = await this.userRepository.createUser(signUpUserCredentials)

    const insertedResult = await userCollection.insertOne(user)

    return (await userCollection.findOne(insertedResult.insertedId)) as IUser
  }

  async findUserByEmail (email: string): Promise<IUser | undefined> {
    const userCollection = MongoHelper.getCollection('users')
    const filter: UserDbFilter = { 'personal.email': email }

    const user = (await userCollection.findOne(filter)) as IUser

    if (user) return user
  }

  async findUserById (id: string): Promise<IUser | undefined> {
    const userCollection = MongoHelper.getCollection('users')

    const filter: UserDbFilter = { 'personal.id': id }
    const user = (await userCollection.findOne(filter)) as IUser

    if (user) return user
  }

  async updateUser (user: IUser, update: UserDbFilter): Promise<IUser | undefined> {
    const userCollection = MongoHelper.getCollection('users')

    const filter: UserDbFilter = { 'personal.id': user.personal.id }
    await userCollection.updateOne(filter, { $set: update })

    const updatedUser = (await userCollection.findOne(filter)) as IUser

    if (updatedUser) return updatedUser
  }
}

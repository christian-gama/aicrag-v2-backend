import { ISignUpUserCredentials, IUser } from '@/domain'

import { UserDbRepositoryProtocol, UserRepositoryProtocol } from '@/application/protocols/repositories'

import { MongoAdapter } from '../../adapters/database'
import { UserDbFilter } from '../protocols'

export class UserDbRepository implements UserDbRepositoryProtocol {
  constructor (private readonly userRepository: UserRepositoryProtocol) {}

  async findUserByEmail (email: string): Promise<IUser | undefined> {
    const userCollection = MongoAdapter.getCollection('users')
    const filter: UserDbFilter = { 'personal.email': email.toLowerCase() }

    const user = (await userCollection.findOne(filter)) as IUser

    if (user) return user
  }

  async findUserById (id: string): Promise<IUser | undefined> {
    const userCollection = MongoAdapter.getCollection('users')

    const filter: UserDbFilter = { 'personal.id': id }
    const user = (await userCollection.findOne(filter)) as IUser

    if (user) return user
  }

  async saveUser (signUpUserCredentials: ISignUpUserCredentials): Promise<IUser> {
    const userCollection = MongoAdapter.getCollection('users')

    const user = await this.userRepository.createUser(signUpUserCredentials)

    const insertedResult = await userCollection.insertOne(user)

    return (await userCollection.findOne(insertedResult.insertedId)) as IUser
  }

  async updateUser (user: IUser, update: UserDbFilter): Promise<IUser | undefined> {
    const userCollection = MongoAdapter.getCollection('users')

    const filter: UserDbFilter = { 'personal.id': user.personal.id }
    await userCollection.updateOne(filter, { $set: update })

    const updatedUser = (await userCollection.findOne(filter)) as IUser

    if (updatedUser) return updatedUser
  }
}
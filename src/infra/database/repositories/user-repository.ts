import { ISignUpUserData, IUser } from '@/domain'
import { IUserRepository, ICreateUserRepository } from '@/domain/repositories'

import { IDatabase, IUserDbFilter } from '../protocols'

export class UserRepository implements IUserRepository {
  constructor (private readonly createUserRepository: ICreateUserRepository, private readonly database: IDatabase) {}

  async findUserByEmail (email: string): Promise<IUser | null> {
    const userCollection = this.database.collection('users')

    const filter: IUserDbFilter = { 'personal.email': email.toLowerCase() }
    const user = await userCollection.findOne<IUser>(filter)

    return user
  }

  async findUserById (id: string): Promise<IUser | null> {
    const userCollection = this.database.collection('users')

    const filter: IUserDbFilter = { 'personal.id': id }
    const user = await userCollection.findOne<IUser>(filter)

    return user
  }

  async saveUser (signUpUserCredentials: ISignUpUserData): Promise<IUser> {
    const userCollection = this.database.collection('users')

    const user = await this.createUserRepository.createUser(signUpUserCredentials)

    return await userCollection.insertOne(user)
  }

  async updateUser<T extends IUser | null>(id: string, update: IUserDbFilter): Promise<T> {
    const userCollection = this.database.collection('users')

    const updatedUser = await userCollection.updateOne<IUser>({ 'personal.id': id }, update)

    return updatedUser as T
  }
}

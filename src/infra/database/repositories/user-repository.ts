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
    const result = await userCollection.findOne<IUser>(filter)

    return result
  }

  async saveUser (signUpUserCredentials: ISignUpUserData): Promise<IUser> {
    const userCollection = this.database.collection('users')

    const user = await this.createUserRepository.createUser(signUpUserCredentials)

    const result = await userCollection.insertOne(user)

    return result as IUser
  }

  async updateUser<T extends IUser | null>(id: string, update: IUserDbFilter): Promise<T> {
    const userCollection = this.database.collection('users')

    const result = await userCollection.updateOne<IUser>({ 'personal.id': id }, update)

    return result as T
  }
}

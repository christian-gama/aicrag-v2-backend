import { ISignUpUserData, IUser } from '@/domain'
import { UserDbRepositoryProtocol, CreateUserRepositoryProtocol } from '@/domain/repositories'

import { DatabaseProtocol, UserDbFilter } from '../protocols'

export class UserDbRepository implements UserDbRepositoryProtocol {
  constructor (
    private readonly createUserRepository: CreateUserRepositoryProtocol,
    private readonly database: DatabaseProtocol
  ) {}

  async findUserByEmail (email: string): Promise<IUser | null> {
    const userCollection = this.database.collection('users')

    const filter: UserDbFilter = { 'personal.email': email.toLowerCase() }
    const user = await userCollection.findOne<IUser>(filter)

    return user
  }

  async findUserById (id: string): Promise<IUser | null> {
    const userCollection = this.database.collection('users')

    const filter: UserDbFilter = { 'personal.id': id }
    const user = await userCollection.findOne<IUser>(filter)

    return user
  }

  async saveUser (signUpUserCredentials: ISignUpUserData): Promise<IUser> {
    const userCollection = this.database.collection('users')

    const user = await this.createUserRepository.createUser(signUpUserCredentials)

    return await userCollection.insertOne(user)
  }

  async updateUser<T extends IUser | null>(id: string, update: UserDbFilter): Promise<T> {
    const userCollection = this.database.collection('users')

    const updatedUser = await userCollection.updateOne<IUser>({ 'personal.id': id }, update)

    return updatedUser as T
  }
}

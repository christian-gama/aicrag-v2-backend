import { ISignUpUserData, IUser } from '@/domain'
import { ICreateUserRepository, IFindAllQuery, IUserRepository } from '@/domain/repositories'
import { getEmail, getName, getId, getRole } from '../helpers'
import { IDatabase, IUserDbFilter } from '../protocols'
import { IQuery, IQueryResult } from '../protocols/queries.model'

export class UserRepository implements IUserRepository {
  constructor (private readonly createUserRepository: ICreateUserRepository, private readonly database: IDatabase) {}

  async findAll<T extends IUser>(query: IFindAllQuery): Promise<IQueryResult<T>> {
    const userCollection = this.database.collection('users')
    const { email, name, id, role } = query
    const _email = getEmail(email)
    const _name = getName(name)
    const _id = getId(id)
    const _role: Record<string, any> = getRole(role)
    const result = await userCollection.aggregate<IUser>(
      [
        {
          $match: {
            'personal.email': _email,
            'personal.id': _id,
            'personal.name': _name,
            'settings.role': _role
          }
        }
      ],
      query
    )

    return result as IQueryResult<T>
  }

  async findAllById (ids: string[], query: IQuery): Promise<IQueryResult<IUser>> {
    const userCollection = this.database.collection('users')

    const filter = { 'personal.id': { $in: ids } }
    const result = await userCollection.findAll<IUser>(filter, query)

    return result
  }

  async findByEmail (email: string): Promise<IUser | null> {
    const userCollection = this.database.collection('users')

    const filter: IUserDbFilter = { 'personal.email': email.toLowerCase() }
    const user = await userCollection.findOne<IUser>(filter)

    return user
  }

  async findById (id: string): Promise<IUser | null> {
    const userCollection = this.database.collection('users')

    const filter: IUserDbFilter = { 'personal.id': id }
    const result = await userCollection.findOne<IUser>(filter)

    return result
  }

  async save (signUpUserCredentials: ISignUpUserData): Promise<IUser> {
    const userCollection = this.database.collection('users')

    const user = await this.createUserRepository.createUser(signUpUserCredentials)

    const result = await userCollection.insertOne(user)

    return result as IUser
  }

  async updateById<T extends IUser | null>(id: string, update: IUserDbFilter): Promise<T> {
    const userCollection = this.database.collection('users')

    const result = await userCollection.updateOne<IUser>({ 'personal.id': id }, update)

    return result as T
  }
}

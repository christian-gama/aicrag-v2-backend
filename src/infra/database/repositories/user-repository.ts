import { ISignUpUserData, IUser } from '@/domain'
import { IUserRepository, ICreateUserRepository, IFindAllQuery } from '@/domain/repositories'
import { IDatabase, IUserDbFilter } from '../protocols'
import { IQuery, IQueryResult } from '../protocols/queries-protocol'

export class UserRepository implements IUserRepository {
  constructor (private readonly createUserRepository: ICreateUserRepository, private readonly database: IDatabase) {}

  async findAll<T extends IUser>(query: IFindAllQuery): Promise<IQueryResult<T>> {
    const userCollection = this.database.collection('users')
    const { email, name, id, role } = query
    const {
      _email,
      _id,
      _name,
      _role
    }: {
      _email:
      | { $options: string, $regex: string, $ne?: undefined }
      | { $ne: null, $options?: undefined, $regex?: undefined }
      _id:
      | { $options: string, $regex: string, $ne?: undefined }
      | { $ne: null, $options?: undefined, $regex?: undefined }
      _name:
      | { $options: string, $regex: string, $ne?: undefined }
      | { $ne: null, $options?: undefined, $regex?: undefined }
      _role: Record<string, any>
    } = a()

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

    function a () {
      const _email = email ? { $options: 'i', $regex: email } : { $ne: null }
      const _name = name ? { $options: 'i', $regex: name } : { $ne: null }
      const _id = id ? { $options: 'i', $regex: id } : { $ne: null }
      let _role: Record<string, any>

      switch (role) {
        case 'administrator':
          _role = { $eq: 'administrator' }
          break
        case 'moderator':
          _role = { $eq: 'moderator' }
          break
        case 'user':
          _role = { $eq: 'user' }
          break
        case 'guest':
          _role = { $eq: 'guest' }
          break
        default:
          _role = { $ne: null }
          break
      }
      return { _email, _id, _name, _role }
    }
  }

  async findAllById<T extends IUser>(ids: string[], query: IQuery): Promise<IQueryResult<T>> {
    const userCollection = this.database.collection('users')

    const filter = { 'personal.id': { $in: ids } }
    const result = await userCollection.findAll<IUser>(filter, query)

    return result as IQueryResult<T>
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

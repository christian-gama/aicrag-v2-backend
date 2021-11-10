import { IRepositoryResult } from '../protocols/repository-helper.model'

export function getEmail (email: string | undefined): IRepositoryResult {
  return email ? { $options: 'i', $regex: email } : { $ne: null }
}

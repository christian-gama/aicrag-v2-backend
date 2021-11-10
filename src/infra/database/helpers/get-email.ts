import { IRepositoryResult } from '../protocols/repository-helper-protocol'

export function getEmail (email: string | undefined): IRepositoryResult {
  return email ? { $options: 'i', $regex: email } : { $ne: null }
}

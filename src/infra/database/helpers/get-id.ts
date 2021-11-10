import { IRepositoryResult } from '../protocols/repository-helper-protocol'

export function getId (id: string | undefined): IRepositoryResult {
  return id ? { $options: 'i', $regex: id } : { $ne: null }
}

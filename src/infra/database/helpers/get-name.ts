import { IRepositoryResult } from '../protocols/repository-helper-protocol'

export function getName (name: string | undefined): IRepositoryResult {
  return name ? { $options: 'i', $regex: name } : { $ne: null }
}

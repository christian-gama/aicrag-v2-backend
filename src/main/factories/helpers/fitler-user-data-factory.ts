import { FilterUserData } from '@/application/usecases/helpers/filter-user-data/filter-user-data'

export const makeFilterUserData = (): FilterUserData => {
  return new FilterUserData()
}

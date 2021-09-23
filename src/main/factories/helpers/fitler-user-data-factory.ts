import { FilterUserData } from '@/application/usecases/helpers'

export const makeFilterUserData = (): FilterUserData => {
  return new FilterUserData()
}

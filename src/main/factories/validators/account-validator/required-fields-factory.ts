import { RequiredFields } from '@/application/usecases/validators/account'

export const makeRequiredFields = (field: string): RequiredFields => {
  return new RequiredFields(field)
}

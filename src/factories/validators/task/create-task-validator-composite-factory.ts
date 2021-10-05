import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/validation-composite'

import { makeRequiredFields, makeValidateDate, makeValidateDuration, makeValidateStatus, makeValidateTaskId, makeValidateType, makeValidateUniqueTaskId } from '.'
import { makeValidateCommentary } from './validate-commentary-factory'

export const makeCreateTaskValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['date', 'duration', 'status', 'type']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  // Must have this exact validation order
  validations.push(makeValidateUniqueTaskId())
  validations.push(makeValidateCommentary())
  validations.push(makeValidateType())
  validations.push(makeValidateDate())
  validations.push(makeValidateDuration())
  validations.push(makeValidateStatus())
  validations.push(makeValidateTaskId())

  const createTaskValidatorComposite = new ValidationComposite(validations)

  return createTaskValidatorComposite
}

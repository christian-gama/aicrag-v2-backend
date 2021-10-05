import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/validation-composite'

import { makeValidateUniqueTaskId, makeValidateType, makeValidateDate, makeValidateDuration, makeValidateStatus, makeValidateTaskId, makeCreateTaskValidatorComposite } from '@/factories/validators/task'
import { makeValidateCommentary } from '@/factories/validators/task/validate-commentary-factory'
import { makeRequiredFields } from '@/factories/validators/validate-required-fields-factory'

jest.mock('../../../../../src/application/validators/validation-composite.ts')

describe('createTaskValidatorComposite', () => {
  it('should create factory with all validations', () => {
    expect.hasAssertions()

    makeCreateTaskValidatorComposite()

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

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})

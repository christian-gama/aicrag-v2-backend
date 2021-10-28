import { environment } from './environment'

export function verifyEnvironment (): void {
  let previousVariable: undefined | string

  function iterateProperties (environment: Record<string, any>): any {
    for (const variable in environment) {
      const variableValue = environment[variable]

      if (isObject(variableValue)) {
        previousVariable = variable
        iterateProperties(variableValue)
      } else {
        if (!variableValue) {
          throw new Error(
            `${
              previousVariable ? previousVariable + ' ' : ''
            }${variable} is undefined - You must set this variable in .env file`
          )
        }
        previousVariable = undefined
      }
    }
  }

  iterateProperties(environment)
}

const isObject = (value: any): boolean => {
  return typeof value === 'object'
}

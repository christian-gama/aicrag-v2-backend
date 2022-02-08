import { environment } from './environment'

export function verifyEnvironment (): void {
  let previousVariable: undefined | string

  if (!environment.DB.MONGO_URL.startsWith('mongodb+srv://') && !environment.DB.MONGO_URL.startsWith('mongodb://')) {
    console.error('Invalid environment variable: MONGO_URL')
    process.exit(1)
  }

  function iterateProperties (environment: Record<string, any>): any {
    for (const variable in environment) {
      const variableValue = environment[variable]

      if (isObject(variableValue)) {
        previousVariable = variable
        iterateProperties(variableValue)
      } else {
        if (!variableValue) {
          console.error(
            `${
              previousVariable ? previousVariable + ' ' : ''
            }${variable} is undefined - You must set this variable in .env file`
          )

          process.exit(1)
        }
        previousVariable = undefined
      }
    }
  }

  iterateProperties(environment)

  console.log('Environment variables are OK')
}

const isObject = (value: any): boolean => {
  return typeof value === 'object'
}

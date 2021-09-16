type RangeNumbers = 0.6 | 0.65 | 0.7 | 0.75 | 0.8 | 0.85 | 0.9 | 0.95 | 1

/**
 * @description User interface that will be persisted to the repository.
 */
export interface User {
  personal: {
    id: string
    name: string
    email: string
    password: string
  }
  settings: {
    accountActivated: boolean
    handicap: RangeNumbers
    currency: 'USD' | 'BRL'
  }
  logs: {
    createdAt: Date
    updatedAt: Date | null
    lastSeenAt: Date | null
    lastLoginAt: Date | null
  }
  temporary: {
    activationCode: string | null
    activationCodeExpiration: Date | null
    refreshToken: string | null
    resetCode: string | null
    resetCodeExpiration: Date | null
    temporaryEmail: string | null
    temporaryEmailExpiration: Date | null
  }
}

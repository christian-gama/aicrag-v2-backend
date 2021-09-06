type rangeNumbers = 0.6 | 0.65 | 0.7 | 0.75 | 0.8 | 0.85 | 0.9 | 0.95 | 1

/**
 * @description User interface that will be persisted to the repository.
 */
export interface User {
  /**
   * @property Personal and sensitive information about the user.
   */
  personal: {
    id: string
    name: string
    email: string
    password: string
  }
  /**
   * @property Settings from the user account.
   */
  settings: {
    accountActivated: boolean
    handicap: rangeNumbers
    currency: 'USD' | 'BRL'
  }
  /**
   * @property Save logs from the the user.
   */
  logs: {
    createdAt: Date
    updatedAt: Date | null
    lastSeenAt: Date | null
    lastLoginAt: Date | null
  }
  /**
   * @property Temporary create properties to help validations. (Optional)
   */
  temporary?: {
    activationCode?: string
    temporaryEmail?: string
    resetCode?: string
  }
}

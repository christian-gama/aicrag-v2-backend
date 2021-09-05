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
    handicap: number
    currency: 'USD' | 'BRL'
  }
  /**
   * @property Save logs from the the user.
   */
  logs: {
    createdAt: Date
    updatedAt: Date
    lastSeen: Date
    lastLogin: Date
  }
  /**
   * @property Temporary create properties to help validations. (Optional)
   */
  temporary?: {
    activationCode: string
    temporaryEmail: string
    resetCode: string
  }
}

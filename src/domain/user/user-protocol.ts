type RangeNumbers = 0.6 | 0.65 | 0.7 | 0.75 | 0.8 | 0.85 | 0.9 | 0.95 | 1

export enum IUserRole {
  administrator = '4',
  moderator = '3',
  user = '2',
  guest = '1'
}

/**
 * @description User interface that will be persisted to the repository.
 */
export interface IUser {
  logs: {
    createdAt: Date
    lastLoginAt: Date | null
    lastSeenAt: Date | null
    updatedAt: Date | null
  }
  personal: {
    email: string
    id: string
    name: string
    password: string
  }
  settings: {
    accountActivated: boolean
    currency: 'USD' | 'BRL'
    handicap: RangeNumbers
    role: IUserRole
  }
  temporary: {
    activationPin: string | null
    activationPinExpiration: Date | null
    resetPasswordToken: string | null
    tempEmail: string | null
    tempEmailPin: string | null
    tempEmailPinExpiration: Date | null
  }
  tokenVersion: number
}

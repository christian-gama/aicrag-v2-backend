export interface User {
  personal: {
    id: string
    name: string
    email: string
    password: string
  }
  settings: {
    active: boolean
    handicap: number
    currency: 'USD' | 'BRL'
  }
  logs: {
    createdAt: Date
    updatedAt: Date
    lastSeen: Date
    lastLogin: Date
  }
  temporary?: {
    activationCode: string
    temporaryEmail: string
    resetCode: string
  }
}

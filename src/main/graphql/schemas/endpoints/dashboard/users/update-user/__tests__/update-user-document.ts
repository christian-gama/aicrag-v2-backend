export const updateUserMutation = (input: {
  accountStatus?: string
  email?: string
  handicap?: number
  id: string
  name?: string
  role?: string
  tokenVersion?: number
}): string => `
  mutation {
    updateUser(input: {
      ${input.accountStatus ? `accountStatus: "${input.accountStatus}",` : ''}
      ${input.email ? `email: "${input.email}",` : ''}
      ${input.handicap ? `handicap: ${input.handicap},` : ''}
      ${input.id ? `id: "${input.id}",` : ''}
      ${input.name ? `name: "${input.name}",` : ''}
      ${input.role ? `role: "${input.role}",` : ''}
      ${input.tokenVersion ? `tokenVersion: ${input.tokenVersion},` : ''}
      }){
        ... on UpdateUserHasChanges {
          user {
              logs {
                  createdAt
                  lastLoginAt
                  lastSeenAt
                  updatedAt
              }
              personal {
                  email
                  id
                  name
              }
              settings {
                  accountActivated
                currency
                handicap
              role
              }
              temporary {
                  activationPin
                  activationPinExpiration
                  resetPasswordToken
                  tempEmail
                  tempEmailPin
                  tempEmailPinExpiration
              }
              tokenVersion
          }
      }
      ... on UpdateUserNoChanges {
          message
      }
    }
  }
`

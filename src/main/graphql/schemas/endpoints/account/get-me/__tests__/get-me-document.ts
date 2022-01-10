export const getMeQuery = (): string => `
  query {
    getMe {
      user {
        personal {
          email
          id
          name
        }
        settings {
          currency
        }
      }
      accessToken
      refreshToken
    }
  }
`

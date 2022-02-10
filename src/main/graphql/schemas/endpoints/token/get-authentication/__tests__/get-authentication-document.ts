export const getAuthentication = (): string => `
  query {
    getAuthentication {
        ...on GetAuthenticationProtected {
          authentication
          accessToken
          refreshToken
          user {
            personal {
              name
            }
          }
        }

        ...on GetAuthenticationPartial {
          authentication
          accessToken
        }

        ...on GetAuthenticationNone {
          authentication
        }
    }
  }
`

export const loginMutation = (input: { email: string, password: string }): string => `
  mutation {
    login(input: { email: "${input.email}", password: "${input.password}" }) {
      ... on ActiveAccount {
          accessToken
          refreshToken
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
      }
      ... on InactiveAccount {
          accessToken
          message
      }
    }
  }
`

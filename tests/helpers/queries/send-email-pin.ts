export const sendEmailPinMutation = (input: { email: string }): string => `
  mutation {
    sendEmailPin(input: { email: "${input.email}" }) {
        message
    }
  }
`

export const sendEmailCodeMutation = (input: { email: string }): string => `
  mutation {
    sendEmailCode(input: { email: "${input.email}" }) {
        message
    }
  }
`

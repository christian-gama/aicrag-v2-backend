export function getRole (role: string | undefined): Record<string, any> {
  let _role: Record<string, any>

  switch (role) {
    case 'administrator':
      _role = { $eq: 'administrator' }
      break
    case 'moderator':
      _role = { $eq: 'moderator' }
      break
    case 'user':
      _role = { $eq: 'user' }
      break
    case 'guest':
      _role = { $eq: 'guest' }
      break
    default:
      _role = { $ne: null }
      break
  }
  return _role
}

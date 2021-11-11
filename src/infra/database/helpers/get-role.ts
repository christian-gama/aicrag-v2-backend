export function getRole (role: string | undefined): Record<string, any> {
  let _role: Record<string, any>

  switch (role) {
    case 'administrator':
      _role = { $eq: 4 }
      break
    case 'moderator':
      _role = { $eq: 3 }
      break
    case 'user':
      _role = { $eq: 2 }
      break
    case 'guest':
      _role = { $eq: 1 }
      break
    default:
      _role = { $ne: null }
      break
  }
  return _role
}

import { User } from '@/domain/user'

type Personal<T extends keyof User> = {
  [Property in keyof Partial<User['personal']> as `${T}.${Property}`]: User['personal'][Property]
}

type Settings<T extends keyof User> = {
  [Property in keyof Partial<User['settings']> as `${T}.${Property}`]: User['settings'][Property]
}

type Logs<T extends keyof User> = {
  [Property in keyof Partial<User['logs']> as `${T}.${Property}`]: User['logs'][Property]
}

type Temporary<T extends keyof User> = {
  [Property in keyof Partial<User['temporary']> as `${T}.${Property}`]: User['temporary'][Property]
}

type TokenVersion<T extends keyof User> = {
  [Property in keyof Partial<User['tokenVersion']> as `${T}`]: User['tokenVersion']
}

export type UserDbFilter =
  | Personal<'personal'>
  | Settings<'settings'>
  | Logs<'logs'>
  | Temporary<'temporary'>
  | TokenVersion<'tokenVersion'>

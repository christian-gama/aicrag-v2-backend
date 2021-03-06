import { IUser } from '@/domain'

type Logs<T extends keyof IUser> = {
  [Property in keyof Partial<IUser['logs']> as `${T}.${Property}`]: IUser['logs'][Property]
}

type Personal<T extends keyof IUser> = {
  [Property in keyof Partial<IUser['personal']> as `${T}.${Property}`]: IUser['personal'][Property]
}

type Settings<T extends keyof IUser> = {
  [Property in keyof Partial<IUser['settings']> as `${T}.${Property}`]: IUser['settings'][Property]
}

type Temporary<T extends keyof IUser> = {
  [Property in keyof Partial<IUser['temporary']> as `${T}.${Property}`]: IUser['temporary'][Property]
}

type TokenVersion<T extends keyof IUser> = {
  [Property in keyof Partial<IUser['tokenVersion']> as `${T}`]: IUser['tokenVersion']
}

export type IUserDbFilter =
  | Logs<'logs'>
  | Personal<'personal'>
  | Settings<'settings'>
  | Temporary<'temporary'>
  | TokenVersion<'tokenVersion'>

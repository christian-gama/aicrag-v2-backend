import { User } from '.'

type Personal = {
  [Property in keyof Partial<User['personal']> as `personal.${string &
  Property}`]: User['personal'][Property]
}

type Settings = {
  [Property in keyof Partial<User['settings']> as `settings.${string &
  Property}`]: User['settings'][Property]
}

type Logs = {
  [Property in keyof Partial<User['logs']> as `logs.${string & Property}`]: User['logs'][Property]
}

type Temporary = {
  [Property in keyof Partial<User['temporary']> as `temporary.${string &
  Property}`]: User['temporary'][Property]
}

export type UpdateUserOptions = Personal | Settings | Logs | Temporary

/**
 * @description Contain alphanumerics inside of an array from 0-9 to a-z.
 * @returns Returns one random alphanumeric (0-9a-z)
 */

export const randomAlphanumeric = (): string => {
  const alphanumerics = [
    '0',
    '0',
    '1',
    '1',
    '2',
    '2',
    '3',
    '3',
    '4',
    '4',
    '5',
    '5',
    '6',
    '6',
    '7',
    '7',
    '8',
    '8',
    '9',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ]

  const randomNumber = Math.floor(Math.random() * (alphanumerics.length - 1))

  let result = ''

  if (randomNumber % 2 === 0) result = alphanumerics[randomNumber]
  else result = alphanumerics[randomNumber].toUpperCase()

  return result
}

export const randomAlphanumeric = (): string => {
  const alphanumerics = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
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

  const randomNumber = (): number => Math.floor(Math.random() * (alphanumerics.length - 1))

  return alphanumerics[randomNumber()]
}
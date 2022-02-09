import { IDateUtils } from '@/domain/helpers'

export class DateUtils implements IDateUtils {
  getUTCDate (date: string): Date {
    const [year, month, day, hour, minute, seconds, milliseconds] = date
      .split('-')
      .join(' ')
      .split('T')
      .join(' ')
      .split(':')
      .join(' ')
      .split('.')
      .join(' ')
      .split(' ')

    return new Date(Date.UTC(+year, +month - 1, +day, +hour, +minute, +seconds, +milliseconds.replace('Z', '')))
  }

  isSameDateString (date: string, dateToCompare: string): boolean {
    return this.getUTCDate(date).toISOString() === this.getUTCDate(dateToCompare).toISOString()
  }
}

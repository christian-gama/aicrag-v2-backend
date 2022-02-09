export interface IDateUtils {
  /**
   * @param date '1970-01-01T00:00:00.000-00:00 / yyyy-MM-ddTHH:mm:ss.SSSZ-HH:mm'
   */
  getUTCDate: (date: string) => Date

  isSameDateString: (date1: string, date2: string) => boolean
}

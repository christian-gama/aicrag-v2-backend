export interface IUiid {
  /**
  * @returns Return an unique 36 digits long identifier following the UUID v4 with the format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  */
  generate: () => string
}

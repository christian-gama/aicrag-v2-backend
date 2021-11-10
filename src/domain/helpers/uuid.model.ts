export interface IUuid {
  /**
   * @description Generate an UUID following the UUID v4 with the format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
   * @returns Return an UUID with the format: format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
   */
  generate: () => string
}

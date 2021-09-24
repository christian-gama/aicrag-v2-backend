export interface ComparerProtocol {
  /**
  * @async Asynchronous method.
  * @description Get a normal value, hashes it and compare with a hashed value, returning a boolean.
  * @param value The first value that will be compared to the second value.
  * @param valueToCompare The second value that will be compared to the first value.
  * @returns Return true if both values are valid and false if not.
  */
  compare: (value: string, valueToCompare: string) => Promise<boolean>
}

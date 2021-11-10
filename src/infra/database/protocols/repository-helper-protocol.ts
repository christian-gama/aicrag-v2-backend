export type IRepositoryResult =
  | { $options: string, $regex: string, $ne?: undefined }
  | { $ne: null, $options?: undefined, $regex?: undefined }

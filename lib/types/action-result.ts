export type ActionResult<T = void> =
  | { data: T; error?: undefined }
  | { data?: undefined; error: string };

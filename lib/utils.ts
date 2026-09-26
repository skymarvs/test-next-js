import { ActionResult } from "@/lib/types/action-result";

export { cn } from "cn";

export function unwrapActionResult<T>(result: ActionResult<T>): T {
  if (result.error) {
    throw new Error(result.error);
  }
  return result.data as T;
}

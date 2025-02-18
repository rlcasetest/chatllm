import { toast } from "sonner";

/**
 * Unwraps an `unknown` value into a `string` if `unknown` was `string` or `Error`.
 */
export function unwrapError(error: unknown) {
  if (typeof error == "string") return error;
  else if ((error as Error)?.message) return (error as Error).message;
  return undefined;
}

/**
 * Wrapper function around `toast` from `sonner`.
 *
 * Tries to convert `error: unknown` into `string` or `Error`.
 * Ignores other inputs.
 */
export function handleError(error: unknown) {
  const errorMessage = unwrapError(error);
  if (errorMessage) {
    toast.error(errorMessage, {
      position: "bottom-center",
    });
    return;
  }

  console.error(error);
}

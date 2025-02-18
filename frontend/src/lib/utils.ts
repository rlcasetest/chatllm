import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Accepts a list of `ClassValue`s (e.g. "flex flex-col"), merges duplicates and applies logic to element's classes.
 * Applying logic to classes allow for a more responsive component, as this pattern scales better with time.
 *
 * `cn(isUser && "animate-spin")` will add the class `animate-spin` if `isUser` is true.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

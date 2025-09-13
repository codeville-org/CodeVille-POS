import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR"
  }).format(price);
}

/**
 * Generates a unique 12-digit number suitable for database constraints
 * Format: TTTTTTTRRRR (7 digits timestamp + 4 digits random + 1 check digit)
 * @returns A 12-digit unique number as a string
 */
export function generateUniqueId(): string {
  // Get current timestamp and use last 7 digits for time component
  const timestamp = Date.now();
  const timeComponent = (timestamp % 10000000).toString().padStart(7, "0");

  // Generate 4-digit random component
  const randomComponent = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  // Generate check digit using simple modulo 10
  const baseNumber = timeComponent + randomComponent;
  const checkDigit = (parseInt(baseNumber) % 10).toString();

  return baseNumber + checkDigit;
}

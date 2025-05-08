import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function formatDate(date) {
    // Implementação da função
    return new Date(date).toLocaleDateString();
  }
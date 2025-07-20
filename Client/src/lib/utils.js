import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Accept destinations as an argument instead of importing
export function getDestinationImage(name, destinations = []) {
  if (!name) return '';
  const lower = name.toLowerCase();
  const found = destinations.find(d => d.name.toLowerCase() === lower || lower.includes(d.name.toLowerCase().split(',')[0]));
  return found ? found.image : '';
}

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { destinations } from '../data/destinations';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getDestinationImage(name) {
  if (!name) return '';
  const lower = name.toLowerCase();
  const found = destinations.find(d => d.name.toLowerCase() === lower || lower.includes(d.name.toLowerCase().split(',')[0]));
  return found ? found.image : '';
}

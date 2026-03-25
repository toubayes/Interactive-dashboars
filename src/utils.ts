import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, lang: string = 'en') {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function formatDate(dateStr: string, lang: string = 'en') {
  return new Date(dateStr).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

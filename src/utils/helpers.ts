import months from '@/constants/months';
import { ONLY_SPACES, PRICE_FORMATTER } from '@/constants/regex';
import { Types } from 'mongoose';

const FRACTION_DIGITS = 2;

export function removeSpaces(str: string) {
  return str.replace(ONLY_SPACES, '');
}

export function roundPrice(num: number): number {
  return +num.toFixed(FRACTION_DIGITS);
}

export function formatPrice(num: number): string {
  const parts = num.toFixed(FRACTION_DIGITS).split('.');
  parts[0] = parts[0].replace(PRICE_FORMATTER, ' ');
  return parts.join('.');
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function equalsPrimitiveArrays(firstArray: any[], secondArray: any[]): boolean {
  return JSON.stringify(firstArray) === JSON.stringify(secondArray);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomElem(arr: unknown[] | string) {
  return arr[randomInt(0, arr.length - 1)];
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateId(): string {
  return new Types.ObjectId().toString();
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}

export function isNode(): boolean {
  return typeof process !== 'undefined'
    && process.versions != null
    && process.versions.node != null;
}

import { EMAIL_REGEX } from '@/constants/regex';
import isBase64 from './isBase64';

export function isValidString(str: string): boolean {
  if (!str || typeof str !== 'string') {
    return false;
  }

  return true;
}

export function isValidImage(image: string) {
  if (!image || !isBase64(image, { mimeRequired: true })) {
    return false;
  }

  return true;
}

export function isValidNumber(number: number) {
  if (number === null || typeof number !== 'number' || Number.isNaN(number)) {
    return false;
  }

  return true;
}

export function isValidObject(o: any) {
  return o != null && typeof o === 'object';
}

export function isValidEmail(email: string) {
  return email && EMAIL_REGEX.test(email);
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

export function isValidDate(value: any) {
  const date = new Date(value);
  return value instanceof Date || (date instanceof Date && !Number.isNaN(+date));
}

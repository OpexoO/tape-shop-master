import { isValidObject } from './validTypes';

export default function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (!isValidObject(obj1) || !isValidObject(obj2)) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (let i = 0; i < keys1.length; i += 1) {
    const key = keys1[i];
    const v1 = obj1[key];
    const v2 = obj2[key];
    const areObjects = isValidObject(v1) && isValidObject(v2);

    if ((areObjects && !deepEqual(v1, v2)) || (!areObjects && v1 !== v2)) return false;
  }

  return true;
}

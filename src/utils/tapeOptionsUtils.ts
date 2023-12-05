import { Option, numberOfRoles, tapeWidth } from '@/constants/tapeOptions';

export const getTapeWidthName = (option: string): string => {
  const [width] = option.split(';');
  return tapeWidth.find((v: Option) => v.id === width)?.name || '';
};

export const getNumberOfRolesName = (option: string): string => {
  const [, role] = option.split(';');
  return numberOfRoles.find((v: Option) => v.id === role)?.name || '';
};
